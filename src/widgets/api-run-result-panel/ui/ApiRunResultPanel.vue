<template>
  <section v-if="firstStep" class="api-run-result-panel" data-testid="api-run-result-panel">
    <a-grid :cols="{ xs: 1, md: 3 }" :col-gap="12" :row-gap="12">
      <a-grid-item>
        <a-statistic
          :title="t.apiAutomation.responseStatus"
          :value="firstStep.response?.statusCode || 0"
          data-testid="api-run-result-status"
        />
      </a-grid-item>
      <a-grid-item>
        <a-statistic
          :title="t.apiAutomation.responseDuration"
          :value="firstStep.durationMs"
          suffix="ms"
        />
      </a-grid-item>
      <a-grid-item>
        <div class="api-run-result-panel__metric">
          <span>{{ t.apiAutomation.lastRunResult }}</span>
          <strong>{{ result?.result || '-' }}</strong>
        </div>
      </a-grid-item>
    </a-grid>

    <a-tabs>
      <a-tab-pane key="body" :title="t.apiAutomation.responseBody">
        <pre class="api-run-result-panel__pre" data-testid="api-run-result-response-body">{{ responseBody }}</pre>
      </a-tab-pane>
      <a-tab-pane key="headers" :title="t.apiAutomation.responseHeaders">
        <pre class="api-run-result-panel__pre">{{ responseHeaders }}</pre>
      </a-tab-pane>
      <a-tab-pane key="assertions" :title="t.apiAutomation.assertionResults">
        <template #title>
          <span data-testid="api-run-result-assertion-tab">{{ t.apiAutomation.assertionResults }}</span>
        </template>
        <div class="api-run-result-panel__items" data-testid="api-run-result-assertion-results">
          <div v-if="!assertionResults.length" class="api-run-result-panel__empty">
            {{ t.apiAutomation.assertionResultEmpty }}
          </div>
          <article
            v-for="assertion in assertionResults"
            v-else
            :key="`${assertion.id || assertion.type}-${assertion.subject}`"
            class="api-run-result-panel__item"
          >
            <AppStatusBadge
              :label="assertion.success ? t.apiAutomation.assertionPassed : t.apiAutomation.assertionFailed"
              :color="assertion.success ? 'green' : 'red'"
            />
            <div>
              <strong>{{ assertion.name || assertionResultTypeLabel(assertion.type) }}</strong>
              <p>{{ assertion.message }}</p>
              <small>
                {{ assertion.subject }}
                <template v-if="assertion.condition">
                  {{ t.apiAutomation.resultSeparator }} {{ assertion.condition }}
                </template>
                <template v-if="assertion.expectedValue">
                  {{ t.apiAutomation.resultSeparator }} {{ t.apiAutomation.assertionExpectedValue }}: {{ assertion.expectedValue }}
                </template>
                <template v-if="assertion.actualValue">
                  {{ t.apiAutomation.resultSeparator }} {{ t.apiAutomation.assertionActualValue }}: {{ assertion.actualValue }}
                </template>
              </small>
            </div>
          </article>
        </div>
      </a-tab-pane>
      <a-tab-pane key="processors" :title="t.apiAutomation.processorResults">
        <template #title>
          <span data-testid="api-run-result-processor-tab">{{ t.apiAutomation.processorResults }}</span>
        </template>
        <div class="api-run-result-panel__items" data-testid="api-run-result-processor-results">
          <div
            v-if="!processorResults.length && !extractionResults.length"
            class="api-run-result-panel__empty"
          >
            {{ t.apiAutomation.processorResultEmpty }}
          </div>
          <article
            v-for="(processor, index) in processorResults"
            :key="`processor-${index}-${processor.name || processor.type}`"
            class="api-run-result-panel__item"
          >
            <AppStatusBadge
              :label="processor.success === false ? t.apiAutomation.processorFailed : t.apiAutomation.processorPassed"
              :color="processor.success === false ? 'red' : 'green'"
            />
            <div>
              <strong>{{ processor.name || processor.type || t.apiAutomation.processorFallbackName }}</strong>
              <p>{{ processor.message || processor.output || '-' }}</p>
              <small v-if="processor.durationMs !== null && processor.durationMs !== undefined">
                {{ t.apiAutomation.responseDuration }}: {{ processor.durationMs }}ms
              </small>
            </div>
          </article>
          <article
            v-for="(extraction, index) in extractionResults"
            :key="`extraction-${index}-${extraction.variableName || extraction.name}`"
            class="api-run-result-panel__item"
          >
            <AppStatusBadge
              :label="extraction.success === false ? t.apiAutomation.processorFailed : t.apiAutomation.processorPassed"
              :color="extraction.success === false ? 'red' : 'green'"
            />
            <div>
              <strong>{{ extraction.variableName || extraction.name || t.apiAutomation.processorTypeExtract }}</strong>
              <p>{{ extraction.message || extraction.value || '-' }}</p>
            </div>
          </article>
        </div>
      </a-tab-pane>
      <a-tab-pane v-if="result.stepResults.length > 1" key="steps" :title="t.apiAutomation.runSteps">
        <div class="api-run-result-panel__items" data-testid="api-run-result-steps">
          <article
            v-for="step in result.stepResults"
            :key="`${step.stepOrder}-${step.stepName}`"
            class="api-run-result-panel__item"
          >
            <AppStatusBadge
              :label="step.success ? t.apiAutomation.processorPassed : t.apiAutomation.processorFailed"
              :color="step.success ? 'green' : 'red'"
            />
            <div>
              <strong>{{ step.stepName || t.apiAutomation.runStepFallback }}</strong>
              <p>{{ t.apiAutomation.responseDuration }}: {{ step.durationMs }}ms</p>
              <small v-if="step.errorMessage">{{ step.errorMessage }}</small>
            </div>
          </article>
        </div>
      </a-tab-pane>
      <a-tab-pane key="raw" :title="t.apiAutomation.runRawResult">
        <pre class="api-run-result-panel__pre">{{ rawResult }}</pre>
      </a-tab-pane>
    </a-tabs>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { ApiRunResponse } from '@entities/api-automation';
import { t } from '@shared/i18n';
import { AppStatusBadge } from '@shared/ui';

const props = defineProps<{
  result: ApiRunResponse;
}>();

const firstStep = computed(() => props.result.stepResults?.[0] || null);
const responseBody = computed(() => firstStep.value?.response?.body || '');
const responseHeaders = computed(() =>
  JSON.stringify(firstStep.value?.response?.headers || {}, null, 2)
);
const assertionResults = computed(() => firstStep.value?.assertionResults || []);
const processorResults = computed(() => firstStep.value?.processorResults || []);
const extractionResults = computed(() => firstStep.value?.extractionResults || []);
const rawResult = computed(() => JSON.stringify(props.result, null, 2));

function assertionResultTypeLabel(type: string) {
  const labels: Record<string, string> = {
    RESPONSE_CODE: t.apiAutomation.assertionTypeStatusCode,
    RESPONSE_HEADER: t.apiAutomation.assertionTypeResponseHeader,
    RESPONSE_BODY: t.apiAutomation.assertionTypeResponseBody,
    RESPONSE_TIME: t.apiAutomation.assertionTypeResponseTime
  };

  return labels[type] || type;
}
</script>

<style scoped>
.api-run-result-panel {
  display: grid;
  gap: var(--app-spacing-md);
  min-width: 0;
}

.api-run-result-panel__metric {
  display: grid;
  gap: 8px;
  min-height: 72px;
  padding: 8px 0;
}

.api-run-result-panel__metric span {
  color: var(--app-color-text-muted);
  font-size: 13px;
}

.api-run-result-panel__metric strong {
  color: var(--app-color-text);
  font-size: 24px;
  font-weight: 500;
  line-height: 1.35;
}

.api-run-result-panel__pre {
  max-height: 280px;
  margin: 0;
  overflow: auto;
  border-radius: var(--app-radius-sm);
  background: #0f172a;
  color: #e2e8f0;
  font-size: 12px;
  line-height: 1.6;
  padding: var(--app-spacing-md);
}

.api-run-result-panel__items {
  display: grid;
  gap: var(--app-spacing-sm);
}

.api-run-result-panel__item,
.api-run-result-panel__empty {
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: var(--app-color-surface);
  padding: var(--app-spacing-sm);
}

.api-run-result-panel__item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--app-spacing-sm);
  align-items: flex-start;
}

.api-run-result-panel__item strong,
.api-run-result-panel__item p,
.api-run-result-panel__item small {
  margin: 0;
}

.api-run-result-panel__item p {
  margin-top: 4px;
}

.api-run-result-panel__item small,
.api-run-result-panel__empty {
  color: var(--app-color-text-muted);
}
</style>
