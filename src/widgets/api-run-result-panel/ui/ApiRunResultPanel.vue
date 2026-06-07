<template>
  <section v-if="firstStep" class="api-run-result-panel" data-testid="api-run-result-panel">
    <div class="api-run-result-panel__summary">
      <a-statistic
        :title="t.apiAutomation.responseStatus"
        :value="firstStep.response?.statusCode || 0"
        data-testid="api-run-result-status"
      />
      <a-statistic
        :title="t.apiAutomation.responseDuration"
        :value="firstStep.durationMs"
        suffix="ms"
      />
      <div class="api-run-result-panel__metric">
        <span>{{ t.apiAutomation.lastRunResult }}</span>
        <strong>{{ result?.result || '-' }}</strong>
      </div>
    </div>

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
            v-for="(step, index) in result.stepResults"
            :key="`${step.stepOrder}-${step.stepName}`"
            class="api-run-result-panel__item"
            data-testid="api-run-result-step-row"
          >
            <AppStatusBadge
              :label="step.success ? t.apiAutomation.processorPassed : t.apiAutomation.processorFailed"
              :color="step.success ? 'green' : 'red'"
            />
            <div>
              <strong>{{ step.stepName || t.apiAutomation.runStepFallback }}</strong>
              <p v-if="stepDisplayMessage(step, index)" class="api-run-result-panel__step-message">
                {{ stepDisplayMessage(step, index) }}
              </p>
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

import type { ApiRunResponse, ApiRunStepResult, ApiScenarioStep } from '@entities/api-automation';
import { t } from '@shared/i18n';
import { AppStatusBadge } from '@shared/ui';

const props = defineProps<{
  result: ApiRunResponse;
  scenarioSteps?: ApiScenarioStep[];
}>();

const firstStep = computed(() => props.result.stepResults?.[0] || null);
const responseBody = computed(() => firstStep.value?.response?.body || '');
const responseHeaders = computed(() =>
  JSON.stringify(firstStep.value?.response?.headers || {}, null, 2)
);
const assertionResults = computed(() => firstStep.value?.assertionResults || []);
const processorResults = computed(() =>
  (props.result.stepResults || []).flatMap((step) => step.processorResults || [])
);
const extractionResults = computed(() =>
  (props.result.stepResults || []).flatMap((step) => step.extractionResults || [])
);
const rawResult = computed(() => JSON.stringify(props.result, null, 2));
const inferredScenarioStepMessages = computed(() => inferScenarioStepMessages(props.scenarioSteps || []));

function assertionResultTypeLabel(type: string) {
  const labels: Record<string, string> = {
    RESPONSE_CODE: t.apiAutomation.assertionTypeStatusCode,
    RESPONSE_HEADER: t.apiAutomation.assertionTypeResponseHeader,
    RESPONSE_BODY: t.apiAutomation.assertionTypeResponseBody,
    RESPONSE_TIME: t.apiAutomation.assertionTypeResponseTime
  };

  return labels[type] || type;
}

function stepDisplayMessage(step: ApiRunStepResult, index: number) {
  return step.message || inferredScenarioStepMessages.value[index] || '';
}

function inferScenarioStepMessages(steps: ApiScenarioStep[]) {
  const messages: string[] = [];
  const onceOnlyKeys = new Set<string>();

  function visit(stepList: ApiScenarioStep[]) {
    for (const step of stepList) {
      if (step.enabled === false) {
        continue;
      }

      if (step.stepType === 'ONCE_ONLY_CONTROLLER') {
        const key = String(step.id || step.stepName || step.name || `once-only-${messages.length + 1}`);
        const firstRun = !onceOnlyKeys.has(key);
        onceOnlyKeys.add(key);
        messages.push(firstRun ? 'Executed' : 'Skipped');

        if (firstRun) {
          visit(step.children || []);
        }
        continue;
      }

      if (step.stepType === 'IF_CONTROLLER') {
        const matched = evaluateExpressionCondition(step.conditionExpression || '');
        messages.push(matched ? 'Condition matched' : 'Condition not matched');

        if (matched) {
          visit(step.children || []);
        }
        continue;
      }

      if (step.stepType === 'LOOP_CONTROLLER') {
        const loopCount = normalizeLoopCount(step.loopCount);
        messages.push(`Loop count: ${loopCount}`);

        for (let index = 0; index < loopCount; index += 1) {
          visit(step.children || []);
        }
        continue;
      }

      messages.push('');

      if (step.children?.length) {
        visit(step.children);
      }
    }
  }

  visit(steps);
  return messages;
}

function evaluateExpressionCondition(expression: string) {
  const normalized = expression.trim().toLowerCase();

  if (!normalized || normalized === 'false') {
    return false;
  }

  if (normalized === 'true') {
    return true;
  }

  const comparison = expression.match(/^(.+?)\s*(==|=|!=|<>|>=|<=|>|<|contains)\s*(.+)$/i);
  if (!comparison) {
    return false;
  }

  const left = comparison[1].trim();
  const operator = comparison[2].toLowerCase();
  const right = comparison[3].trim();
  const leftNumber = Number(left);
  const rightNumber = Number(right);
  const canCompareNumber = Number.isFinite(leftNumber) && Number.isFinite(rightNumber);

  if (operator === 'contains') {
    return left.includes(right);
  }

  if (operator === '==' || operator === '=') {
    return left === right;
  }

  if (operator === '!=' || operator === '<>') {
    return left !== right;
  }

  if (!canCompareNumber) {
    return false;
  }

  if (operator === '>=') {
    return leftNumber >= rightNumber;
  }

  if (operator === '<=') {
    return leftNumber <= rightNumber;
  }

  if (operator === '>') {
    return leftNumber > rightNumber;
  }

  return leftNumber < rightNumber;
}

function normalizeLoopCount(loopCount?: number | string | null) {
  const value = Number(loopCount ?? 1);

  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(0, Math.min(50, Math.round(value)));
}
</script>

<style scoped>
.api-run-result-panel {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.api-run-result-panel__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  overflow: hidden;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: var(--app-color-surface);
}

.api-run-result-panel__summary :deep(.arco-statistic),
.api-run-result-panel__metric {
  display: grid;
  gap: 4px;
  min-height: 58px;
  border-right: 1px solid var(--app-color-border);
  padding: 9px 12px;
}

.api-run-result-panel__metric {
  border-right: 0;
}

.api-run-result-panel__summary :deep(.arco-statistic-title) {
  margin-bottom: 0;
  color: var(--app-color-text-muted);
  font-size: 12px;
}

.api-run-result-panel__summary :deep(.arco-statistic-value) {
  font-size: 22px;
  line-height: 1.2;
}

.api-run-result-panel__metric span {
  color: var(--app-color-text-muted);
  font-size: 13px;
}

.api-run-result-panel__metric strong {
  color: var(--app-color-text);
  font-size: 20px;
  font-weight: 500;
  line-height: 1.2;
}

.api-run-result-panel__pre {
  max-height: 260px;
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
  gap: 0;
  overflow: hidden;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
}

.api-run-result-panel__item,
.api-run-result-panel__empty {
  border-bottom: 1px solid var(--app-color-border);
  background: var(--app-color-surface);
  padding: 8px 10px;
}

.api-run-result-panel__item:last-child,
.api-run-result-panel__empty:last-child {
  border-bottom: 0;
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

.api-run-result-panel__step-message {
  display: inline-flex;
  width: fit-content;
  border-radius: var(--app-radius-sm);
  background: rgba(var(--primary-6), 0.08);
  color: rgb(var(--primary-7));
  font-size: 12px;
  padding: 1px 6px;
}

.api-run-result-panel__item small,
.api-run-result-panel__empty {
  color: var(--app-color-text-muted);
}

@media (max-width: 720px) {
  .api-run-result-panel__summary {
    grid-template-columns: 1fr;
  }

  .api-run-result-panel__summary :deep(.arco-statistic),
  .api-run-result-panel__metric {
    border-right: 0;
    border-bottom: 1px solid var(--app-color-border);
  }

  .api-run-result-panel__metric {
    border-bottom: 0;
  }
}
</style>
