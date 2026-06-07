<template>
  <section class="api-run-result-panel" data-testid="api-run-result-panel">
    <header class="api-run-result-panel__header" data-testid="api-run-result-header">
      <strong>{{ t.apiAutomation.responseShellTitle }}</strong>
      <div v-if="firstStep" class="api-run-result-panel__metrics" data-testid="api-run-result-metrics">
        <span
          class="api-run-result-panel__metric"
          :class="`is-${resultTone}`"
        >
          {{ result?.result || '-' }}
        </span>
        <span
          class="api-run-result-panel__metric"
          :class="`is-${statusTone}`"
          data-testid="api-run-result-status"
        >
          {{ t.apiAutomation.responseStatus }} {{ firstStep.response?.statusCode || 0 }}
        </span>
        <span class="api-run-result-panel__metric" :class="`is-${durationTone}`">
          {{ t.apiAutomation.responseDuration }} {{ firstStep.durationMs ?? '-' }} ms
        </span>
        <span class="api-run-result-panel__metric">
          {{ t.apiAutomation.responseSize }} {{ responseSize }}
        </span>
      </div>
      <span v-else>{{ t.apiAutomation.responseShellEmpty }}</span>
    </header>

    <div class="api-run-result-panel__content-panel" data-testid="api-run-result-content-panel">
      <div v-if="!firstStep" class="api-run-result-panel__empty-state">
        <div class="api-run-result-panel__empty-card">
          <div class="api-run-result-panel__empty-visual">
            <div class="api-run-result-panel__empty-window">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div class="api-run-result-panel__empty-text">{{ t.apiAutomation.responseShellHint }}</div>
        </div>
      </div>

      <a-tabs v-else class="api-run-result-panel__tabs">
        <a-tab-pane key="body" :title="t.apiAutomation.responseBody">
          <div class="api-run-result-panel__body">
            <pre class="api-run-result-panel__pre" data-testid="api-run-result-response-body">{{ responseBody }}</pre>
          </div>
        </a-tab-pane>
        <a-tab-pane key="headers" :title="t.apiAutomation.responseHeaders">
          <div class="api-run-result-panel__body">
            <pre class="api-run-result-panel__pre">{{ responseHeaders }}</pre>
          </div>
        </a-tab-pane>
        <a-tab-pane key="assertions" :title="t.apiAutomation.assertionResults">
          <template #title>
            <span data-testid="api-run-result-assertion-tab">{{ t.apiAutomation.assertionResults }}</span>
          </template>
          <div class="api-run-result-panel__body">
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
          </div>
        </a-tab-pane>
        <a-tab-pane key="processors" :title="t.apiAutomation.processorResults">
          <template #title>
            <span data-testid="api-run-result-processor-tab">{{ t.apiAutomation.processorResults }}</span>
          </template>
          <div class="api-run-result-panel__body">
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
          </div>
        </a-tab-pane>
        <a-tab-pane v-if="result?.stepResults.length > 1" key="steps" :title="t.apiAutomation.runSteps">
          <div class="api-run-result-panel__body">
            <div class="api-run-result-panel__items api-run-result-panel__steps" data-testid="api-run-result-steps">
              <article
                v-for="(step, index) in result.stepResults"
                :key="`${step.stepOrder}-${step.stepName}`"
                class="api-run-result-panel__item api-run-result-panel__step"
                data-testid="api-run-result-step-row"
              >
                <span class="api-run-result-panel__step-order">{{ step.stepOrder || index + 1 }}</span>
                <AppStatusBadge
                  :label="step.success ? t.apiAutomation.processorPassed : t.apiAutomation.processorFailed"
                  :color="step.success ? 'green' : 'red'"
                />
                <div class="api-run-result-panel__step-main">
                  <strong>{{ step.stepName || t.apiAutomation.runStepFallback }}</strong>
                  <p v-if="stepDisplayMessage(step, index)" class="api-run-result-panel__step-message">
                    {{ stepDisplayMessage(step, index) }}
                  </p>
                  <small v-if="step.errorMessage">{{ step.errorMessage }}</small>
                </div>
                <span class="api-run-result-panel__step-duration">
                  {{ step.durationMs ?? '-' }} ms
                </span>
              </article>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="raw" :title="t.apiAutomation.runRawResult">
          <div class="api-run-result-panel__body">
            <pre class="api-run-result-panel__pre">{{ rawResult }}</pre>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { ApiRunResponse, ApiRunStepResult, ApiScenarioStep } from '@entities/api-automation';
import { t } from '@shared/i18n';
import { AppStatusBadge } from '@shared/ui';

const props = defineProps<{
  result?: ApiRunResponse | null;
  scenarioSteps?: ApiScenarioStep[];
}>();

const firstStep = computed(() => props.result?.stepResults?.[0] || null);
const responseBody = computed(() => firstStep.value?.response?.body || '');
const responseHeaders = computed(() =>
  JSON.stringify(firstStep.value?.response?.headers || {}, null, 2)
);
const assertionResults = computed(() => firstStep.value?.assertionResults || []);
const processorResults = computed(() =>
  (props.result?.stepResults || []).flatMap((step) => step.processorResults || [])
);
const extractionResults = computed(() =>
  (props.result?.stepResults || []).flatMap((step) => step.extractionResults || [])
);
const rawResult = computed(() => JSON.stringify(props.result, null, 2));
const inferredScenarioStepMessages = computed(() => inferScenarioStepMessages(props.scenarioSteps || []));
const responseSize = computed(() => formatResponseSize(responseBody.value));
const statusTone = computed(() => {
  const statusCode = firstStep.value?.response?.statusCode || 0;

  if (statusCode >= 200 && statusCode < 300) {
    return 'success';
  }

  if (statusCode >= 400) {
    return 'failed';
  }

  return 'muted';
});
const durationTone = computed(() => {
  const duration = firstStep.value?.durationMs;

  if (duration === null || duration === undefined) {
    return 'muted';
  }

  return duration > 1000 ? 'slow' : 'success';
});
const resultTone = computed(() => {
  const result = String(props.result?.result || '').toLowerCase();

  if (result.includes('pass') || result.includes('success')) {
    return 'success';
  }

  if (result.includes('fail') || result.includes('error')) {
    return 'failed';
  }

  return 'muted';
});

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

function formatResponseSize(value: string) {
  const bytes = new Blob([value]).size;

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  return `${(bytes / 1024).toFixed(1)} KB`;
}
</script>

<style scoped>
.api-run-result-panel {
  display: flex;
  min-height: 0;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: var(--app-color-surface);
}

.api-run-result-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 40px;
  min-width: 0;
  flex: 0 0 auto;
  border-bottom: 1px solid var(--app-color-border);
  background: var(--app-color-surface);
  padding: 8px 14px;
}

.api-run-result-panel__header strong {
  min-width: max-content;
  color: var(--app-color-text);
  font-size: 14px;
  font-weight: 650;
  line-height: 1.4;
}

.api-run-result-panel__header > span {
  color: var(--app-color-text-muted);
  font-size: 12px;
}

.api-run-result-panel__metrics {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  min-width: 0;
  flex-wrap: wrap;
}

.api-run-result-panel__metric {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  color: var(--app-color-text-muted);
  font-size: 12px;
  line-height: 1.4;
  white-space: nowrap;
}

.api-run-result-panel__metric.is-success {
  color: #039855;
}

.api-run-result-panel__metric.is-failed {
  color: #d92d20;
}

.api-run-result-panel__metric.is-slow {
  color: #dc6803;
}

.api-run-result-panel__content-panel {
  display: flex;
  min-height: 0;
  min-width: 0;
  flex: 1 1 auto;
  flex-direction: column;
  background: var(--app-color-surface);
  overflow: hidden;
}

.api-run-result-panel__tabs {
  display: flex;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
}

.api-run-result-panel__tabs :deep(.arco-tabs-nav) {
  flex: 0 0 auto;
  margin-bottom: 0;
  border-bottom: 1px solid var(--app-color-border);
  padding: 0 14px;
}

.api-run-result-panel__tabs :deep(.arco-tabs-nav-tab) {
  min-height: 40px;
}

.api-run-result-panel__tabs :deep(.arco-tabs-tab) {
  margin: 0;
  padding: 0 11px;
  color: var(--app-color-text-muted);
  font-size: 13px;
}

.api-run-result-panel__tabs :deep(.arco-tabs-tab-active) {
  color: rgb(var(--primary-6));
  font-weight: 600;
}

.api-run-result-panel__tabs :deep(.arco-tabs-content) {
  min-height: 0;
  flex: 1 1 auto;
  padding-top: 0;
}

.api-run-result-panel__tabs :deep(.arco-tabs-content-list),
.api-run-result-panel__tabs :deep(.arco-tabs-pane) {
  min-height: 100%;
}

.api-run-result-panel__body {
  display: flex;
  min-height: 260px;
  min-width: 0;
  flex-direction: column;
  padding: 12px;
}

.api-run-result-panel__empty-state {
  display: flex;
  min-height: 180px;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.api-run-result-panel__empty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.api-run-result-panel__empty-window {
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: var(--app-color-bg);
  padding: 8px 10px;
}

.api-run-result-panel__empty-window span {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--app-color-text-muted);
  opacity: 0.55;
}

.api-run-result-panel__empty-text {
  color: var(--app-color-text-muted);
  font-size: 13px;
  line-height: 1.5;
  text-align: center;
}

.api-run-result-panel__empty-visual {
  display: flex;
  justify-content: center;
}

.api-run-result-panel__pre {
  min-height: 220px;
  max-height: 360px;
  margin: 0;
  flex: 1 1 auto;
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
  min-height: 0;
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
  min-height: 42px;
}

.api-run-result-panel__item strong,
.api-run-result-panel__item p,
.api-run-result-panel__item small {
  margin: 0;
}

.api-run-result-panel__item p {
  margin-top: 4px;
  color: var(--app-color-text-muted);
  font-size: 12px;
  line-height: 1.45;
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

.api-run-result-panel__steps {
  overflow: auto;
}

.api-run-result-panel__step {
  grid-template-columns: 28px auto minmax(0, 1fr) max-content;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 7px 10px;
}

.api-run-result-panel__step-order {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: var(--app-radius-sm);
  background: var(--app-color-bg);
  color: var(--app-color-text-muted);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.api-run-result-panel__step-main {
  min-width: 0;
}

.api-run-result-panel__step-main strong {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-run-result-panel__step-duration {
  color: var(--app-color-text-muted);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

@media (max-width: 720px) {
  .api-run-result-panel__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .api-run-result-panel__metrics {
    justify-content: flex-start;
  }

  .api-run-result-panel__body {
    min-height: 220px;
  }

  .api-run-result-panel__step {
    grid-template-columns: 24px minmax(0, 1fr);
  }

  .api-run-result-panel__step > .app-status-badge,
  .api-run-result-panel__step-duration {
    grid-column: 2;
  }
}
</style>
