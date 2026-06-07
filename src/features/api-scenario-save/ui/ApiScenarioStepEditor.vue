<template>
  <section class="api-scenario-step-editor" data-testid="api-scenario-step-editor">
    <header v-if="depth === 0" class="api-scenario-step-editor__toolbar">
      <h3>{{ t.apiAutomation.scenarioSteps }}</h3>
      <div class="api-scenario-step-editor__toolbar-actions">
        <AppButton type="text" data-testid="api-scenario-add-definition-step" @click="addStep('API')">
          {{ t.apiAutomation.scenarioAddDefinitionStep }}
        </AppButton>
        <AppButton type="text" data-testid="api-scenario-add-case-step" @click="addStep('API_CASE')">
          {{ t.apiAutomation.scenarioAddCaseStep }}
        </AppButton>
        <AppButton type="text" data-testid="api-scenario-add-custom-step" @click="addStep('CUSTOM_REQUEST')">
          {{ t.apiAutomation.scenarioAddCustomStep }}
        </AppButton>
        <AppButton type="text" data-testid="api-scenario-add-wait-step" @click="addStep('CONSTANT_TIMER')">
          {{ t.apiAutomation.scenarioAddWaitStep }}
        </AppButton>
        <AppButton type="text" data-testid="api-scenario-add-script-step" @click="addStep('SCRIPT')">
          {{ t.apiAutomation.scenarioAddScriptStep }}
        </AppButton>
        <AppButton type="text" data-testid="api-scenario-add-once-step" @click="addStep('ONCE_ONLY_CONTROLLER')">
          {{ t.apiAutomation.scenarioAddOnceOnlyStep }}
        </AppButton>
        <AppButton type="text" data-testid="api-scenario-add-if-step" @click="addStep('IF_CONTROLLER')">
          {{ t.apiAutomation.scenarioAddIfStep }}
        </AppButton>
        <AppButton type="text" data-testid="api-scenario-add-loop-step" @click="addStep('LOOP_CONTROLLER')">
          {{ t.apiAutomation.scenarioAddLoopStep }}
        </AppButton>
        <AppButton type="text" data-testid="api-scenario-add-group-step" @click="addStep('GROUP')">
          {{ t.apiAutomation.scenarioAddGroupStep }}
        </AppButton>
      </div>
    </header>

    <div v-if="!steps.length" class="api-scenario-step-editor__empty">
      {{ t.apiAutomation.scenarioStepEmpty }}
    </div>

    <article
      v-for="(step, index) in steps"
      :key="step.id || index"
      class="api-scenario-step-editor__row"
      data-testid="api-scenario-step-row"
      :data-depth="depth"
      :data-step-type="displayStepType(step)"
    >
      <div class="api-scenario-step-editor__head">
        <a-select
          :model-value="displayStepType(step)"
          data-testid="api-scenario-step-type-select"
          @update:model-value="(value) => changeStepType(index, value)"
        >
          <a-option value="API">{{ t.apiAutomation.scenarioStepDefinition }}</a-option>
          <a-option value="API_CASE">{{ t.apiAutomation.scenarioStepCase }}</a-option>
          <a-option value="CUSTOM_REQUEST">{{ t.apiAutomation.scenarioStepCustom }}</a-option>
          <a-option value="CONSTANT_TIMER">{{ t.apiAutomation.scenarioStepWait }}</a-option>
          <a-option value="SCRIPT">{{ t.apiAutomation.scenarioStepScript }}</a-option>
          <a-option value="ONCE_ONLY_CONTROLLER">{{ t.apiAutomation.scenarioStepOnceOnly }}</a-option>
          <a-option value="IF_CONTROLLER">{{ t.apiAutomation.scenarioStepIf }}</a-option>
          <a-option value="LOOP_CONTROLLER">{{ t.apiAutomation.scenarioStepLoop }}</a-option>
          <a-option value="GROUP">{{ t.apiAutomation.scenarioStepGroup }}</a-option>
        </a-select>
        <a-input
          :model-value="step.name"
          data-testid="api-scenario-step-name-input"
          :placeholder="t.apiAutomation.scenarioStepNamePlaceholder"
          @update:model-value="(value) => patchStep(index, { name: value, stepName: value })"
        />
        <div class="api-scenario-step-editor__actions">
          <AppButton
            type="text"
            data-testid="api-scenario-step-move-up"
            :disabled="index === 0"
            @click="moveStep(index, -1)"
          >
            {{ t.apiAutomation.scenarioMoveUp }}
          </AppButton>
          <AppButton
            type="text"
            data-testid="api-scenario-step-move-down"
            :disabled="index === steps.length - 1"
            @click="moveStep(index, 1)"
          >
            {{ t.apiAutomation.scenarioMoveDown }}
          </AppButton>
          <AppButton type="text" data-testid="api-scenario-step-delete" @click="removeStep(index)">
            {{ t.common.delete }}
          </AppButton>
        </div>
      </div>

      <a-grid :cols="{ xs: 1, md: 2 }" :col-gap="12" :row-gap="12">
        <a-grid-item v-if="step.stepType === 'API'">
          <a-select
            :model-value="step.definitionId || undefined"
            allow-clear
            data-testid="api-scenario-definition-select"
            :placeholder="t.apiAutomation.scenarioDefinitionPlaceholder"
            @update:model-value="(value) => selectDefinition(index, value)"
          >
            <a-option v-for="definition in definitions" :key="definition.id" :value="definition.id">
              {{ definition.name }}
            </a-option>
          </a-select>
        </a-grid-item>
        <a-grid-item v-if="step.stepType === 'API_CASE'">
          <a-select
            :model-value="step.caseId || undefined"
            allow-clear
            data-testid="api-scenario-case-select"
            :placeholder="t.apiAutomation.scenarioCasePlaceholder"
            @update:model-value="(value) => selectCase(index, value)"
          >
            <a-option v-for="caseItem in cases" :key="caseItem.id" :value="caseItem.id">
              {{ caseItem.name }}
            </a-option>
          </a-select>
        </a-grid-item>
        <a-grid-item v-if="step.stepType === 'CUSTOM_REQUEST' && !isGroupStep(step)">
          <a-input
            :model-value="step.requestConfig?.path || ''"
            data-testid="api-scenario-custom-path-input"
            :placeholder="t.apiAutomation.fieldPathPlaceholder"
            @update:model-value="(value) => patchCustomPath(index, value)"
          />
        </a-grid-item>
        <a-grid-item v-if="step.stepType === 'CUSTOM_REQUEST' && !isGroupStep(step)">
          <a-select
            :model-value="step.requestConfig?.method || 'GET'"
            data-testid="api-scenario-custom-method-select"
            @update:model-value="(value) => patchCustomMethod(index, value)"
          >
            <a-option v-for="method in requestMethods" :key="method" :value="method">
              {{ method }}
            </a-option>
          </a-select>
        </a-grid-item>
        <a-grid-item v-if="step.stepType === 'CONSTANT_TIMER'">
          <a-input-number
            :model-value="step.delayMs || 1000"
            data-testid="api-scenario-wait-delay-input"
            :min="1"
            :max="60000"
            :step="10"
            :placeholder="t.apiAutomation.scenarioWaitDelayPlaceholder"
            @update:model-value="(value) => patchWaitDelay(index, value)"
          />
        </a-grid-item>
        <a-grid-item v-if="step.stepType === 'SCRIPT'" :span="2">
          <a-textarea
            :model-value="step.script || ''"
            data-testid="api-scenario-script-input"
            :auto-size="{ minRows: 5, maxRows: 10 }"
            :placeholder="t.apiAutomation.scenarioScriptPlaceholder"
            @update:model-value="(value) => patchScript(index, value)"
          />
        </a-grid-item>
        <a-grid-item v-if="step.stepType === 'IF_CONTROLLER'" :span="2">
          <a-input
            :model-value="step.conditionExpression || ''"
            data-testid="api-scenario-condition-expression-input"
            :placeholder="t.apiAutomation.scenarioConditionExpressionPlaceholder"
            @update:model-value="(value) => patchConditionExpression(index, value)"
          />
        </a-grid-item>
        <a-grid-item v-if="step.stepType === 'LOOP_CONTROLLER'">
          <a-input-number
            :model-value="step.loopCount || 1"
            data-testid="api-scenario-loop-count-input"
            :min="0"
            :max="50"
            :step="1"
            :placeholder="t.apiAutomation.scenarioLoopCountPlaceholder"
            @update:model-value="(value) => patchLoopCount(index, value)"
          />
        </a-grid-item>
      </a-grid>

      <section v-if="isChildContainerStep(step)" class="api-scenario-step-editor__children">
        <header>
          <strong>{{ t.apiAutomation.scenarioNestedSteps }}</strong>
          <div class="api-scenario-step-editor__child-actions">
            <AppButton type="text" data-testid="api-scenario-add-child-definition-step" @click="addChildStep(index, 'API')">
              {{ t.apiAutomation.scenarioAddDefinitionStep }}
            </AppButton>
            <AppButton type="text" data-testid="api-scenario-add-child-case-step" @click="addChildStep(index, 'API_CASE')">
              {{ t.apiAutomation.scenarioAddCaseStep }}
            </AppButton>
            <AppButton type="text" data-testid="api-scenario-add-child-custom-step" @click="addChildStep(index, 'CUSTOM_REQUEST')">
              {{ t.apiAutomation.scenarioAddCustomStep }}
            </AppButton>
          </div>
        </header>
        <ApiScenarioStepEditor
          :model-value="step.children || []"
          :definitions="definitions"
          :cases="cases"
          :depth="depth + 1"
          @update:model-value="(value) => patchStep(index, { children: value })"
        />
      </section>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import {
  createCustomRequestStep,
  createDefaultRequestConfig,
  createGroupStep,
  createIfControllerStep,
  createLoopControllerStep,
  createOnceOnlyStep,
  createReferenceCaseStep,
  createReferenceDefinitionStep,
  createScriptStep,
  createWaitStep,
  type ApiDefinitionCaseItem,
  type ApiDefinitionItem,
  type ApiScenarioStep,
  type ApiScenarioStepType
} from '@entities/api-automation';
import { t } from '@shared/i18n';
import { AppButton } from '@shared/ui';

const props = withDefaults(
  defineProps<{
    modelValue: ApiScenarioStep[];
    definitions?: ApiDefinitionItem[];
    cases?: ApiDefinitionCaseItem[];
    depth?: number;
  }>(),
  {
    definitions: () => [],
    cases: () => [],
    depth: 0
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: ApiScenarioStep[]];
}>();

const requestMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;
const steps = computed(() => props.modelValue);

function updateSteps(nextSteps: ApiScenarioStep[]) {
  emit('update:modelValue', nextSteps);
}

function patchStep(index: number, patch: Partial<ApiScenarioStep>) {
  updateSteps(props.modelValue.map((step, currentIndex) =>
    currentIndex === index ? { ...step, ...patch } : step
  ));
}

function addStep(type: ApiScenarioStepType) {
  updateSteps([...props.modelValue, createStep(type)]);
}

function addChildStep(index: number, type: ApiScenarioStepType) {
  const current = props.modelValue[index];
  patchStep(index, {
    children: [...(current.children || []), createStep(type)]
  });
}

function removeStep(index: number) {
  updateSteps(props.modelValue.filter((_, currentIndex) => currentIndex !== index));
}

function moveStep(index: number, direction: -1 | 1) {
  const targetIndex = index + direction;

  if (targetIndex < 0 || targetIndex >= props.modelValue.length) {
    return;
  }

  const nextSteps = [...props.modelValue];
  const [current] = nextSteps.splice(index, 1);
  nextSteps.splice(targetIndex, 0, current);
  updateSteps(nextSteps);
}

function changeStepType(index: number, type: ApiScenarioStepType) {
  const current = props.modelValue[index];
  const template = createStep(type);
  const shouldKeepChildren = isChildContainerType(type);
  const next = {
    ...template,
    id: current.id,
    name: type === 'GROUP' ? t.apiAutomation.scenarioStepGroup : current.name || template.name,
    stepName: type === 'GROUP' ? t.apiAutomation.scenarioStepGroup : current.stepName || current.name || template.name,
    children: shouldKeepChildren ? current.children || [] : []
  };

  patchStep(index, next);
}

function selectDefinition(index: number, value: number | string | undefined) {
  const selected = props.definitions.find((item) => item.id === Number(value));
  patchStep(index, {
    definitionId: value ? Number(value) : null,
    definitionName: selected?.name || null,
    resourceId: value ? Number(value) : null,
    resourceType: value ? 'DEFINITION' : null,
    name: selected?.name || t.apiAutomation.scenarioStepDefinition
  });
}

function selectCase(index: number, value: number | string | undefined) {
  const selected = props.cases.find((item) => item.id === Number(value));
  patchStep(index, {
    caseId: value ? Number(value) : null,
    caseName: selected?.name || null,
    resourceId: value ? Number(value) : null,
    resourceType: value ? 'CASE' : null,
    name: selected?.name || t.apiAutomation.scenarioStepCase
  });
}

function patchCustomPath(index: number, path: string) {
  const current = props.modelValue[index];
  patchStep(index, {
    resource: path,
    resourceId: null,
    resourceType: 'CUSTOM',
    requestConfig: {
      ...(current.requestConfig || createDefaultRequestConfig()),
      path
    }
  });
}

function patchCustomMethod(index: number, method: string) {
  const current = props.modelValue[index];
  patchStep(index, {
    requestConfig: {
      ...(current.requestConfig || createDefaultRequestConfig()),
      method
    }
  });
}

function patchWaitDelay(index: number, delayMs: number | string | null | undefined) {
  const value = Number(delayMs ?? 1000);
  patchStep(index, {
    delayMs: Number.isFinite(value) ? Math.max(1, Math.min(60000, Math.round(value))) : 1000,
    resourceId: null,
    resourceType: null,
    requestConfig: null,
    children: []
  });
}

function patchScript(index: number, script: string) {
  patchStep(index, {
    script,
    resourceId: null,
    resourceType: null,
    requestConfig: null,
    children: []
  });
}

function patchConditionExpression(index: number, conditionExpression: string) {
  patchStep(index, {
    conditionType: 'EXPRESSION',
    conditionExpression,
    resourceId: null,
    resourceType: null,
    requestConfig: null
  });
}

function patchLoopCount(index: number, loopCount: number | string | null | undefined) {
  const value = Number(loopCount ?? 1);
  patchStep(index, {
    loopType: 'FIXED',
    loopCount: Number.isFinite(value) ? Math.max(0, Math.min(50, Math.round(value))) : 1,
    resourceId: null,
    resourceType: null,
    requestConfig: null
  });
}

function createStep(type: ApiScenarioStepType) {
  if (type === 'API') {
    return createReferenceDefinitionStep();
  }

  if (type === 'API_CASE') {
    return createReferenceCaseStep();
  }

  if (type === 'GROUP') {
    return createGroupStep();
  }

  if (type === 'CONSTANT_TIMER') {
    return createWaitStep();
  }

  if (type === 'SCRIPT') {
    return createScriptStep();
  }

  if (type === 'ONCE_ONLY_CONTROLLER') {
    return createOnceOnlyStep();
  }

  if (type === 'IF_CONTROLLER') {
    return createIfControllerStep();
  }

  if (type === 'LOOP_CONTROLLER') {
    return createLoopControllerStep();
  }

  return createCustomRequestStep();
}

function isGroupStep(step: ApiScenarioStep) {
  return (
    step.stepType === 'GROUP' ||
    String(step.id || '').startsWith('group-') ||
    step.name === t.apiAutomation.scenarioStepGroup ||
    step.name === 'Step Group'
  );
}

function displayStepType(step: ApiScenarioStep) {
  return isGroupStep(step) ? 'GROUP' : step.stepType;
}

function isChildContainerStep(step: ApiScenarioStep) {
  return isGroupStep(step) || isChildContainerType(step.stepType);
}

function isChildContainerType(type: ApiScenarioStepType) {
  return type === 'ONCE_ONLY_CONTROLLER' || type === 'IF_CONTROLLER' || type === 'LOOP_CONTROLLER';
}
</script>

<style scoped>
.api-scenario-step-editor,
.api-scenario-step-editor__row,
.api-scenario-step-editor__children {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.api-scenario-step-editor__toolbar,
.api-scenario-step-editor__head,
.api-scenario-step-editor__children header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-spacing-sm);
  min-width: 0;
}

.api-scenario-step-editor__toolbar-actions,
.api-scenario-step-editor__actions,
.api-scenario-step-editor__child-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-end;
}

.api-scenario-step-editor__toolbar {
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: #f8fafc;
  padding: 7px 9px;
}

.api-scenario-step-editor__toolbar h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 650;
}

.api-scenario-step-editor__row,
.api-scenario-step-editor__empty {
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: var(--app-color-surface);
  padding: 8px;
}

.api-scenario-step-editor__head {
  display: grid;
  grid-template-columns: 150px minmax(160px, 1fr) auto;
  align-items: center;
}

.api-scenario-step-editor__row[data-depth='1'] {
  background: #fbfcfe;
}

.api-scenario-step-editor__row[data-depth='2'],
.api-scenario-step-editor__row[data-depth='3'] {
  background: #f8fafc;
}

.api-scenario-step-editor__children {
  border-left: 2px solid rgba(var(--primary-6), 0.28);
  margin-left: 6px;
  padding: 6px 0 0 10px;
}

.api-scenario-step-editor__children > header {
  color: var(--app-color-text-muted);
  font-size: 12px;
}

.api-scenario-step-editor :deep(.arco-select-view-single),
.api-scenario-step-editor :deep(.arco-input-wrapper),
.api-scenario-step-editor :deep(.arco-input-number) {
  min-height: 30px;
}

.api-scenario-step-editor__actions :deep(.arco-btn),
.api-scenario-step-editor__toolbar-actions :deep(.arco-btn),
.api-scenario-step-editor__child-actions :deep(.arco-btn) {
  height: 28px;
  padding: 0 6px;
}

.api-scenario-step-editor__empty {
  color: var(--app-color-text-muted);
}

@media (max-width: 860px) {
  .api-scenario-step-editor__toolbar,
  .api-scenario-step-editor__head,
  .api-scenario-step-editor__children header {
    display: grid;
    grid-template-columns: 1fr;
  }
}
</style>
