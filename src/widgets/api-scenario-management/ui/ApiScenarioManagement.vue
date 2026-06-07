<template>
  <section class="api-scenario-management" data-testid="api-scenario-management">
    <header class="api-scenario-management__header">
      <div>
        <h3>{{ t.apiAutomation.scenarioSection }}</h3>
        <p>{{ t.apiAutomation.scenarioDescription }}</p>
      </div>
      <div class="api-scenario-management__actions">
        <AppButton
          type="text"
          :loading="loading"
          data-testid="api-scenario-retry"
          @click="loadScenarios"
        >
          {{ t.common.retry }}
        </AppButton>
        <AppButton type="primary" data-testid="api-scenario-create" @click="openCreateDialog">
          {{ t.apiAutomation.scenarioCreate }}
        </AppButton>
      </div>
    </header>

    <a-alert v-if="errorMessage" type="error" show-icon>
      <template #title>{{ errorMessage }}</template>
    </a-alert>

    <a-grid :cols="{ xs: 1, lg: 3 }" :col-gap="12" :row-gap="12">
      <a-grid-item>
        <section
          class="api-scenario-management__panel api-scenario-management__module-pane"
          data-testid="api-scenario-module-rail"
        >
          <div class="api-scenario-management__module-tools">
            <AppButton type="primary" data-testid="api-scenario-rail-create" @click="openCreateDialog">
              {{ t.apiAutomation.scenarioCreate }}
            </AppButton>
            <a-input
              v-model="moduleKeyword"
              allow-clear
              data-testid="api-scenario-module-search"
              :placeholder="t.apiAutomation.scenarioModuleSearchPlaceholder"
            />
          </div>
          <div class="api-scenario-management__module-title">
            <h4>{{ t.apiAutomation.scenarioModules }}</h4>
            <span>{{ scenarios.length }}</span>
          </div>
          <div class="api-scenario-management__modules" data-testid="api-scenario-modules">
            <button
              type="button"
              class="api-scenario-management__module-row api-scenario-management__module-row--active"
              data-testid="api-scenario-module-row"
            >
              <span class="api-scenario-management__module-folder"></span>
              <strong>{{ t.apiAutomation.scenarioModuleAll }}</strong>
              <small>{{ scenarios.length }}</small>
            </button>
            <button
              v-for="module in filteredModules"
              :key="module.id"
              type="button"
              class="api-scenario-management__module-row"
              data-testid="api-scenario-module-row"
            >
              <span class="api-scenario-management__module-folder"></span>
              <strong>{{ module.name }}</strong>
              <small>{{ module.scenarioCount ?? 0 }}</small>
              <em>{{ module.fullPath }}</em>
            </button>
            <div v-if="modules.length && !filteredModules.length" class="api-scenario-management__empty">
              {{ t.apiAutomation.scenarioModuleEmpty }}
            </div>
          </div>
        </section>
      </a-grid-item>
      <a-grid-item :span="2">
        <section class="api-scenario-management__workbench" data-testid="api-scenario-workbench">
          <div class="api-scenario-management__editor-tabs" data-testid="api-scenario-editor-tabs">
            <button
              type="button"
              :class="[
                'api-scenario-management__editor-tab',
                { 'api-scenario-management__editor-tab--active': activeEditorTab === 'list' }
              ]"
              data-testid="api-scenario-list-editor-tab"
              @click="activeEditorTab = 'list'"
            >
              {{ t.apiAutomation.scenarioList }}
            </button>
            <button
              v-if="editingScenarioForm"
              type="button"
              :class="[
                'api-scenario-management__editor-tab',
                { 'api-scenario-management__editor-tab--active': activeEditorTab === 'editor' }
              ]"
              data-testid="api-scenario-editor-tab"
              @click="activeEditorTab = 'editor'"
            >
              {{ editingScenarioForm.name || t.apiAutomation.scenarioEditTitle }}
              <span class="api-scenario-management__dirty-dot"></span>
            </button>
            <button type="button" class="api-scenario-management__tab-add" @click="openCreateDialog">
              +
            </button>
          </div>

          <div v-if="activeEditorTab === 'list'" class="api-scenario-management__list-workspace">
            <section class="api-scenario-management__panel">
              <div class="api-scenario-management__list-toolbar">
                <div>
                  <h4>{{ t.apiAutomation.scenarioList }}</h4>
                  <span>{{ t.apiAutomation.scenarioListTotal.replace('{count}', String(scenarios.length)) }}</span>
                </div>
                <div class="api-scenario-management__list-filters">
                  <a-input
                    v-model="scenarioKeyword"
                    allow-clear
                    data-testid="api-scenario-list-search"
                    :placeholder="t.apiAutomation.scenarioListSearchPlaceholder"
                  />
                </div>
              </div>
              <AppLoadingState v-if="loading" />
              <div v-else-if="!filteredScenarios.length" class="api-scenario-management__empty">
                {{ t.apiAutomation.scenarioEmpty }}
              </div>
              <div v-else class="api-scenario-management__list" data-testid="api-scenario-list">
                <div class="api-scenario-management__list-head">
                  <span>{{ t.apiAutomation.scenarioId }}</span>
                  <span>{{ t.apiAutomation.scenarioName }}</span>
                  <span>{{ t.apiAutomation.fieldStatus }}</span>
                  <span>{{ t.apiAutomation.lastRunResult }}</span>
                  <span></span>
                </div>
                <article
                  v-for="scenario in filteredScenarios"
                  :key="scenario.id"
                  class="api-scenario-management__row"
                  data-testid="api-scenario-row"
                  @click="selectScenario(scenario.id)"
                >
                  <span class="api-scenario-management__row-id">#{{ 100000 + scenario.id }}</span>
                  <button type="button" class="api-scenario-management__row-main" @click.stop="selectScenario(scenario.id)">
                    <strong>{{ scenario.name }}</strong>
                    <small>{{ scenario.moduleName || t.apiAutomation.scenarioModuleAll }}</small>
                  </button>
                  <small class="api-scenario-management__status">{{ scenarioStatusLabel(scenario.status) }}</small>
                  <small class="api-scenario-management__result">{{ scenario.lastRunResult || '-' }}</small>
                  <div class="api-scenario-management__row-actions" @click.stop>
                    <ApiScenarioRunButton
                      :scenario-id="scenario.id"
                      :environment-id="environmentId"
                      :variable-set-id="variableSetId"
                      @success="setRunResult"
                    />
                    <AppButton type="text" data-testid="api-scenario-edit" @click="openEditorWorkspace(scenario.id)">
                      {{ t.common.edit }}
                    </AppButton>
                    <ApiScenarioDeleteButton :scenario-id="scenario.id" @success="loadScenarios" />
                  </div>
                </article>
              </div>
            </section>
          </div>

          <div v-else class="api-scenario-management__editor-workspace" data-testid="api-scenario-editor-workspace">
            <section class="api-scenario-management__editor-main">
              <a-spin :loading="editorLoading">
                <a-tabs
                  v-model:active-key="activeScenarioDetailTab"
                  class="api-scenario-management__detail-tabs"
                  data-testid="api-scenario-detail-tabs"
                >
                  <a-tab-pane key="steps" :title="t.apiAutomation.scenarioSteps">
                    <ApiScenarioStepEditor
                      v-if="editingScenarioForm"
                      v-model="editingScenarioForm.steps"
                      :definitions="definitions()"
                      :cases="cases"
                      :selected-step-key="selectedStepKey"
                      @select-step="setSelectedStep"
                    />
                  </a-tab-pane>
                  <a-tab-pane key="params" :title="t.apiAutomation.scenarioParams">
                    <div class="api-scenario-management__editor-placeholder">
                      {{ t.apiAutomation.scenarioEditorShellHint }}
                    </div>
                  </a-tab-pane>
                  <a-tab-pane key="assertions" :title="t.apiAutomation.scenarioAssertions">
                    <div class="api-scenario-management__editor-placeholder">
                      {{ t.apiAutomation.scenarioEditorShellHint }}
                    </div>
                  </a-tab-pane>
                  <a-tab-pane key="history">
                    <template #title>
                      <span data-testid="api-scenario-history-tab">{{ t.apiAutomation.scenarioHistory }}</span>
                    </template>
                    <div class="api-scenario-management__history" data-testid="api-scenario-workbench-history">
                      <div v-if="!runResult?.stepResults?.length" class="api-scenario-management__editor-placeholder">
                        {{ t.apiAutomation.scenarioHistoryEmpty }}
                      </div>
                      <div v-else class="api-scenario-management__history-table">
                        <div class="api-scenario-management__history-head">
                          <span>#</span>
                          <span>{{ t.apiAutomation.scenarioHistoryStep }}</span>
                          <span>{{ t.apiAutomation.scenarioHistoryResult }}</span>
                          <span>{{ t.apiAutomation.scenarioHistoryDuration }}</span>
                        </div>
                        <article
                          v-for="step in runResult.stepResults"
                          :key="`${step.stepOrder}-${step.stepName}`"
                          class="api-scenario-management__history-row"
                          data-testid="api-run-result-step-row"
                        >
                          <span>{{ step.stepOrder || '-' }}</span>
                          <strong>{{ step.stepName || t.apiAutomation.runStepFallback }}</strong>
                          <span>{{ step.success ? t.apiAutomation.assertionPassed : t.apiAutomation.assertionFailed }}</span>
                          <span>{{ step.durationMs ?? '-' }} ms</span>
                        </article>
                      </div>
                    </div>
                  </a-tab-pane>
                  <a-tab-pane key="result">
                    <template #title>
                      <span data-testid="api-scenario-result-tab">{{ t.apiAutomation.scenarioRunResult }}</span>
                    </template>
                    <div class="api-scenario-management__run-result" data-testid="api-scenario-workbench-run-result">
                      <ApiRunResultPanel
                        :result="runResult"
                        :scenario-steps="editingScenarioForm?.steps || []"
                      />
                    </div>
                  </a-tab-pane>
                  <a-tab-pane key="settings" :title="t.apiAutomation.requestTabSettings">
                    <div class="api-scenario-management__editor-placeholder">
                      {{ t.apiAutomation.scenarioEditorSettingsHint }}
                    </div>
                  </a-tab-pane>
                </a-tabs>
              </a-spin>
            </section>

            <aside class="api-scenario-management__property-panel" data-testid="api-scenario-property-panel">
              <header>
                <div>
                  <strong>{{ t.apiAutomation.scenarioPropertyPanel }}</strong>
                  <small>{{ editingScenarioForm?.name || t.apiAutomation.scenarioEditTitle }}</small>
                </div>
                <span>{{ editingScenarioId || '-' }}</span>
              </header>
              <template v-if="editingScenarioForm">
                <section class="api-scenario-management__property-section">
                  <h5>{{ t.apiAutomation.scenarioBasicInfo }}</h5>
                  <label>
                    <span>{{ t.apiAutomation.scenarioName }}</span>
                    <a-input
                      v-model="editingScenarioForm.name"
                      data-testid="api-scenario-workbench-name-input"
                      :placeholder="t.apiAutomation.scenarioNamePlaceholder"
                    />
                  </label>
                  <label>
                    <span>{{ t.apiAutomation.fieldStatus }}</span>
                    <a-select v-model="editingScenarioForm.status">
                      <a-option value="ACTIVE">{{ t.apiAutomation.scenarioStatusActive }}</a-option>
                      <a-option value="DISABLED">{{ t.apiAutomation.scenarioStatusDisabled }}</a-option>
                    </a-select>
                  </label>
                  <label>
                    <span>{{ t.apiAutomation.fieldDescription }}</span>
                    <a-textarea
                      v-model="editingScenarioForm.description"
                      :auto-size="{ minRows: 3, maxRows: 5 }"
                      :placeholder="t.apiAutomation.fieldDescriptionPlaceholder"
                    />
                  </label>
                </section>

                <section class="api-scenario-management__property-section" data-testid="api-scenario-property-run-context">
                  <h5>{{ t.apiAutomation.runContextSection }}</h5>
                  <label>
                    <span>{{ t.apiAutomation.environmentSelect }}</span>
                    <a-select
                      v-model="editingScenarioForm.environmentId"
                      allow-clear
                      :placeholder="t.apiAutomation.environmentDefault"
                    >
                      <a-option v-for="environment in environments" :key="environment.id" :value="environment.id">
                        {{ environment.name }}
                      </a-option>
                    </a-select>
                  </label>
                  <label>
                    <span>{{ t.apiAutomation.variableSetSelect }}</span>
                    <a-select
                      v-model="editingScenarioForm.variableSetId"
                      allow-clear
                      :placeholder="t.apiAutomation.variableSetDefault"
                    >
                      <a-option v-for="variableSet in variableSets" :key="variableSet.id" :value="variableSet.id">
                        {{ variableSet.name }}
                      </a-option>
                    </a-select>
                  </label>
                </section>

                <section class="api-scenario-management__property-section" data-testid="api-scenario-property-step-stats">
                  <h5>{{ t.apiAutomation.scenarioStepStats }}</h5>
                  <div class="api-scenario-management__stat-grid">
                    <span>
                      {{ t.apiAutomation.scenarioStepTotal }}
                      <strong>{{ scenarioStepStats.total }}</strong>
                    </span>
                    <span>
                      {{ t.apiAutomation.scenarioControllerTotal }}
                      <strong>{{ scenarioStepStats.controllers }}</strong>
                    </span>
                    <span>
                      {{ t.apiAutomation.scenarioDisabledStepTotal }}
                      <strong>{{ scenarioStepStats.disabled }}</strong>
                    </span>
                    <span>
                      {{ t.apiAutomation.scenarioLastRunResult }}
                      <strong>{{ runResult?.result || selectedScenarioItem?.lastRunResult || '-' }}</strong>
                    </span>
                  </div>
                </section>

                <section
                  class="api-scenario-management__property-section api-scenario-management__step-inspector"
                  data-testid="api-scenario-selected-step-inspector"
                >
                  <h5>{{ t.apiAutomation.scenarioSelectedStepInspector }}</h5>
                  <div v-if="selectedStep" class="api-scenario-management__inspector-grid">
                    <span>
                      {{ t.apiAutomation.scenarioInspectorName }}
                      <strong>{{ selectedStep.name || selectedStep.stepName || '-' }}</strong>
                    </span>
                    <span>
                      {{ t.apiAutomation.scenarioInspectorType }}
                      <strong>{{ scenarioStepTypeLabel(selectedStep.stepType) }}</strong>
                    </span>
                    <span>
                      {{ t.apiAutomation.scenarioInspectorEnabled }}
                      <strong>{{ selectedStep.enabled === false ? t.apiAutomation.scenarioStatusDisabled : t.apiAutomation.scenarioStatusActive }}</strong>
                    </span>
                    <span>
                      {{ t.apiAutomation.scenarioInspectorResource }}
                      <strong>{{ selectedStepResource }}</strong>
                    </span>
                    <span>
                      {{ t.apiAutomation.scenarioInspectorRequest }}
                      <strong>{{ selectedStepRequestSummary }}</strong>
                    </span>
                  </div>
                  <div v-else class="api-scenario-management__inspector-empty">
                    {{ t.apiAutomation.scenarioSelectedStepEmpty }}
                  </div>
                </section>

                <div class="api-scenario-management__property-actions" data-testid="api-scenario-property-actions">
                  <AppButton
                    type="primary"
                    :loading="saving"
                    data-testid="api-scenario-workbench-save"
                    @click="saveEditorWorkspace"
                  >
                    {{ t.apiAutomation.save }}
                  </AppButton>
                  <ApiScenarioRunButton
                    v-if="editingScenarioId"
                    :scenario-id="editingScenarioId"
                    :environment-id="editingScenarioForm.environmentId ?? environmentId"
                    :variable-set-id="editingScenarioForm.variableSetId ?? variableSetId"
                    @success="handleWorkbenchRunSuccess"
                  />
                </div>
              </template>
            </aside>
          </div>
        </section>
      </a-grid-item>
    </a-grid>

    <AppDrawer
      v-model:visible="detailVisible"
      :title="selectedScenarioDetail?.name || t.apiAutomation.scenarioDetailTitle"
      width="760"
    >
      <a-spin :loading="detailLoading">
        <div class="api-scenario-management__drawer" data-testid="api-scenario-detail">
          <a-descriptions :column="2" bordered size="small" class="api-scenario-management__meta">
            <a-descriptions-item :label="t.apiAutomation.fieldDescription">
              {{ selectedScenarioDetail?.description || '-' }}
            </a-descriptions-item>
            <a-descriptions-item :label="t.apiAutomation.fieldStatus">
              {{ selectedScenarioDetail?.status || '-' }}
            </a-descriptions-item>
          </a-descriptions>

          <section>
            <h4 class="api-scenario-management__drawer-title">{{ t.apiAutomation.scenarioSteps }}</h4>
            <div v-if="!selectedScenarioDetail?.steps?.length" class="api-scenario-management__empty">
              {{ t.apiAutomation.scenarioStepEmpty }}
            </div>
            <div v-else class="api-scenario-management__steps" data-testid="api-scenario-step-tree">
              <ScenarioStepNode
                v-for="(step, index) in selectedScenarioDetail.steps"
                :key="`${step.id || step.stepName || 'step'}-${index}`"
                :step="step"
              />
            </div>
          </section>

          <section v-if="runResult" data-testid="api-scenario-run-result">
            <h4 class="api-scenario-management__drawer-title">{{ t.apiAutomation.scenarioRunResult }}</h4>
            <ApiRunResultPanel :result="runResult" :scenario-steps="selectedScenarioDetail?.steps || []" />
          </section>
        </div>
      </a-spin>
    </AppDrawer>

    <ApiScenarioDialog
      ref="scenarioDialogRef"
      :mode="dialogMode"
      :scenario-id="editingScenarioId"
      :definitions="definitions()"
      :cases="cases"
      @success="loadScenarios"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, nextTick, ref, watch } from 'vue';

import {
  apiAutomationApi,
  createScenarioEditForm,
  type ApiDefinitionItem,
  type ApiEnvironmentItem,
  type ApiRunResponse,
  type ApiScenarioFormValues,
  type ApiScenarioItem,
  type ApiScenarioStep,
  type ApiVariableSetItem
} from '@entities/api-automation';
import { useWorkspaceStore } from '@entities/workspace';
import { ApiScenarioDeleteButton } from '@features/api-scenario-delete';
import { ApiScenarioRunButton } from '@features/api-scenario-run';
import { ApiScenarioDialog, ApiScenarioStepEditor, useApiScenarioSave } from '@features/api-scenario-save';
import { t } from '@shared/i18n';
import { AppButton, AppDrawer, AppLoadingState } from '@shared/ui';
import { ApiRunResultPanel } from '@widgets/api-run-result-panel';

import { useApiScenarioManagement } from '../model/useApiScenarioManagement';

const props = defineProps<{
  definitions: ApiDefinitionItem[];
  environments?: ApiEnvironmentItem[];
  variableSets?: ApiVariableSetItem[];
  environmentId?: number | null;
  variableSetId?: number | null;
}>();

const {
  loading,
  detailLoading,
  errorMessage,
  scenarios,
  modules,
  cases,
  definitions,
  selectedScenarioDetail,
  runResult,
  loadScenarios,
  selectScenario,
  setRunResult
} = useApiScenarioManagement(() => props.definitions);

const workspaceStore = useWorkspaceStore();
const { saving, saveScenario } = useApiScenarioSave();
const detailVisible = ref(false);
const dialogMode = ref<'create' | 'edit'>('create');
const editingScenarioId = ref<number | null>(null);
const activeEditorTab = ref<'list' | 'editor'>('list');
const activeScenarioDetailTab = ref('steps');
const editorLoading = ref(false);
const editingScenarioForm = ref<ApiScenarioFormValues | null>(null);
const moduleKeyword = ref('');
const scenarioKeyword = ref('');
const selectedStep = ref<ApiScenarioStep | null>(null);
const selectedStepKey = ref<string | null>(null);
const scenarioDialogRef = ref<{
  openCreate: () => void;
  openEdit: () => void | Promise<void>;
} | null>(null);

const filteredModules = computed(() => {
  const keyword = moduleKeyword.value.trim().toLowerCase();

  if (!keyword) {
    return modules.value;
  }

  return modules.value.filter((module) =>
    [module.name, module.fullPath]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword))
  );
});

const filteredScenarios = computed(() => {
  const keyword = scenarioKeyword.value.trim().toLowerCase();

  if (!keyword) {
    return scenarios.value;
  }

  return scenarios.value.filter((scenario) =>
    [scenario.name, scenario.moduleName, scenario.status, scenario.lastRunResult, String(scenario.id)]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword))
  );
});

const selectedScenarioItem = computed<ApiScenarioItem | null>(
  () => scenarios.value.find((item) => item.id === editingScenarioId.value) || null
);

const scenarioStepStats = computed(() => {
  const stats = {
    total: 0,
    controllers: 0,
    disabled: 0
  };
  const controllerTypes = new Set([
    'IF_CONTROLLER',
    'LOOP_CONTROLLER',
    'ONCE_ONLY_CONTROLLER',
    'CONSTANT_TIMER',
    'SCRIPT',
    'GROUP'
  ]);

  function visit(steps: ApiScenarioStep[] = []) {
    for (const step of steps) {
      stats.total += 1;

      if (controllerTypes.has(step.stepType)) {
        stats.controllers += 1;
      }

      if (step.enabled === false) {
        stats.disabled += 1;
      }

      visit(step.children || []);
    }
  }

  visit(editingScenarioForm.value?.steps || []);
  return stats;
});

const selectedStepResource = computed(() => {
  const step = selectedStep.value;

  if (!step) {
    return '-';
  }

  if (step.definitionName) {
    return step.definitionName;
  }

  if (step.caseName) {
    return step.caseName;
  }

  if (step.resource) {
    return step.resource;
  }

  if (step.resourceType || step.resourceId) {
    return [step.resourceType, step.resourceId].filter(Boolean).join(' #');
  }

  return '-';
});

const selectedStepRequestSummary = computed(() => {
  const requestConfig = selectedStep.value?.requestConfig;

  if (!requestConfig) {
    return '-';
  }

  return `${requestConfig.method || 'GET'} ${requestConfig.path || '-'}`;
});

async function openCreateDialog() {
  dialogMode.value = 'create';
  editingScenarioId.value = null;
  await nextTick();
  scenarioDialogRef.value?.openCreate();
}

async function openEditorWorkspace(id: number) {
  editingScenarioId.value = id;
  activeEditorTab.value = 'editor';
  activeScenarioDetailTab.value = 'steps';
  editorLoading.value = true;
  selectedStep.value = null;
  selectedStepKey.value = null;

  try {
    const detail = await apiAutomationApi.getScenarioDetail(id, workspaceStore.currentWorkspace.code);
    editingScenarioForm.value = createScenarioEditForm(detail);
  } finally {
    editorLoading.value = false;
  }
}

async function saveEditorWorkspace() {
  if (!editingScenarioForm.value || !editingScenarioId.value) {
    return;
  }

  const succeed = await saveScenario(editingScenarioForm.value, editingScenarioId.value);

  if (succeed) {
    await loadScenarios();
    await openEditorWorkspace(editingScenarioId.value);
  }
}

function handleWorkbenchRunSuccess(result: ApiRunResponse) {
  setRunResult(result);
  activeScenarioDetailTab.value = 'result';
}

function setSelectedStep(step: ApiScenarioStep, key: string) {
  selectedStep.value = step;
  selectedStepKey.value = key;
}

function scenarioStatusLabel(status?: string | null) {
  if (status === 'ACTIVE') {
    return t.apiAutomation.scenarioStatusActive;
  }

  if (status === 'DISABLED') {
    return t.apiAutomation.scenarioStatusDisabled;
  }

  return status || '-';
}

function scenarioStepTypeLabel(type: string) {
  const labels: Record<string, string> = {
    API: t.apiAutomation.scenarioStepDefinition,
    API_CASE: t.apiAutomation.scenarioStepCase,
    CUSTOM_REQUEST: t.apiAutomation.scenarioStepCustom,
    CONSTANT_TIMER: t.apiAutomation.scenarioStepWait,
    SCRIPT: t.apiAutomation.scenarioStepScript,
    ONCE_ONLY_CONTROLLER: t.apiAutomation.scenarioStepOnceOnly,
    IF_CONTROLLER: t.apiAutomation.scenarioStepIf,
    LOOP_CONTROLLER: t.apiAutomation.scenarioStepLoop,
    GROUP: t.apiAutomation.scenarioStepGroup
  };

  return labels[type] || type;
}

watch(selectedScenarioDetail, (value) => {
  detailVisible.value = !!value;
});

watch(() => editingScenarioForm.value?.steps, (steps) => {
  if (!selectedStep.value && steps?.length) {
    selectedStep.value = steps[0];
    selectedStepKey.value = `/0-${steps[0].id || steps[0].stepType || 'step'}`;
  }
}, { immediate: true });

const ScenarioStepNode = defineComponent({
  name: 'ScenarioStepNode',
  props: {
    step: {
      type: Object as () => ApiScenarioStep,
      required: true
    }
  },
  setup(stepProps) {
    function typeLabel(type: string) {
      const labels: Record<string, string> = {
        API: t.apiAutomation.scenarioStepDefinition,
        API_CASE: t.apiAutomation.scenarioStepCase,
        CUSTOM_REQUEST: t.apiAutomation.scenarioStepCustom,
        CONSTANT_TIMER: t.apiAutomation.scenarioStepWait,
        SCRIPT: t.apiAutomation.scenarioStepScript,
        ONCE_ONLY_CONTROLLER: t.apiAutomation.scenarioStepOnceOnly,
        IF_CONTROLLER: t.apiAutomation.scenarioStepIf,
        LOOP_CONTROLLER: t.apiAutomation.scenarioStepLoop,
        GROUP: t.apiAutomation.scenarioStepGroup
      };
      return labels[type] || type;
    }

    return () =>
      h('article', { class: ['api-scenario-management__step', `api-scenario-management__step--${String(stepProps.step.stepType || 'unknown').toLowerCase().replaceAll('_', '-')}`] }, [
        h('div', { class: 'api-scenario-management__step-main' }, [
          h('span', { class: 'api-scenario-management__step-type' }, typeLabel(stepProps.step.stepType)),
          h('strong', stepProps.step.name || typeLabel(stepProps.step.stepType))
        ]),
        stepProps.step.children?.length
          ? h(
              'div',
              { class: 'api-scenario-management__step-children' },
              stepProps.step.children.map((child, index) =>
                h(ScenarioStepNode, {
                  key: `${child.id || child.stepName || 'step'}-${index}`,
                  step: child
                })
              )
            )
          : null
      ]);
  }
});
</script>

<style scoped>
.api-scenario-management,
.api-scenario-management__panel,
.api-scenario-management__drawer,
.api-scenario-management__list,
.api-scenario-management__modules,
.api-scenario-management__steps {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.api-scenario-management__header,
.api-scenario-management__actions,
.api-scenario-management__row,
.api-scenario-management__row-actions {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--app-spacing-sm);
  min-width: 0;
}

.api-scenario-management__actions,
.api-scenario-management__row-actions {
  flex-wrap: wrap;
  justify-content: flex-end;
}

.api-scenario-management__header h3,
.api-scenario-management__header p,
.api-scenario-management__panel h4,
.api-scenario-management__drawer h4 {
  margin: 0;
}

.api-scenario-management__header h3,
.api-scenario-management__panel h4,
.api-scenario-management__drawer h4 {
  color: var(--app-color-text);
  font-size: 15px;
  font-weight: 650;
}

.api-scenario-management__header p,
.api-scenario-management__empty,
.api-scenario-management__row small,
.api-scenario-management__modules small,
.api-scenario-management__step small {
  color: var(--app-color-text-muted);
}

.api-scenario-management__panel,
.api-scenario-management__module-row,
.api-scenario-management__step {
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: var(--app-color-surface);
  padding: var(--app-spacing-sm);
}

.api-scenario-management__panel {
  padding: 10px;
}

.api-scenario-management__module-pane {
  align-content: start;
  gap: 0;
  min-height: 100%;
  padding: 0;
  overflow: hidden;
}

.api-scenario-management__module-tools {
  display: grid;
  gap: 8px;
  border-bottom: 1px solid var(--app-color-border);
  padding: 12px;
}

.api-scenario-management__module-tools :deep(.arco-input-wrapper) {
  min-height: 34px;
  border-radius: 7px;
  background: #ffffff;
}

.api-scenario-management__module-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 38px;
  padding: 0 12px;
  border-bottom: 1px solid var(--app-color-border);
}

.api-scenario-management__module-title span {
  color: var(--app-color-text-muted);
  font-size: 12px;
}

.api-scenario-management__workbench {
  display: grid;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: var(--app-color-surface);
}

.api-scenario-management__editor-tabs {
  display: flex;
  align-items: center;
  min-width: 0;
  border-bottom: 1px solid var(--app-color-border);
  background: #f9fafb;
}

.api-scenario-management__editor-tab,
.api-scenario-management__tab-add {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  min-width: 0;
  border: 0;
  border-right: 1px solid var(--app-color-border);
  background: transparent;
  color: var(--app-color-text-muted);
  cursor: pointer;
  font-size: 13px;
  padding: 0 11px;
}

.api-scenario-management__editor-tab {
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-scenario-management__editor-tab--active {
  background: #ffffff;
  color: var(--app-color-text);
  font-weight: 650;
}

.api-scenario-management__dirty-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: rgb(var(--primary-6));
}

.api-scenario-management__tab-add {
  width: 34px;
  justify-content: center;
  color: rgb(var(--primary-6));
  font-size: 18px;
}

.api-scenario-management__list-workspace {
  min-width: 0;
  padding: 8px;
}

.api-scenario-management__list-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-spacing-sm);
  min-height: 52px;
  border-bottom: 1px solid var(--app-color-border);
  padding: 8px 12px;
}

.api-scenario-management__list-toolbar div {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.api-scenario-management__list-toolbar span,
.api-scenario-management__list-toolbar small {
  color: var(--app-color-text-muted);
  font-size: 12px;
}

.api-scenario-management__list-filters {
  width: min(260px, 42vw);
}

.api-scenario-management__list-filters :deep(.arco-input-wrapper) {
  min-height: 32px;
  border-radius: 7px;
}

.api-scenario-management__editor-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  min-width: 0;
  min-height: 620px;
  background: #ffffff;
}

.api-scenario-management__editor-main {
  min-width: 0;
  border-right: 1px solid var(--app-color-border);
  padding: 0;
  overflow: hidden;
}

.api-scenario-management__detail-tabs :deep(.arco-tabs-nav) {
  margin: 0;
  padding: 0 12px;
  background: #f9fafb;
}

.api-scenario-management__detail-tabs :deep(.arco-tabs-tab) {
  height: 40px;
  margin: 0;
  padding: 0 10px;
  color: var(--app-color-text-muted);
  font-size: 13px;
}

.api-scenario-management__detail-tabs :deep(.arco-tabs-tab-active) {
  color: var(--app-color-text);
  font-weight: 650;
}

.api-scenario-management__detail-tabs :deep(.arco-tabs-content) {
  padding: 10px 12px 12px;
  background: #ffffff;
}

.api-scenario-management__editor-placeholder {
  display: grid;
  min-height: 240px;
  align-content: center;
  justify-items: center;
  border: 1px dashed var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: #fbfcfe;
  color: var(--app-color-text-muted);
  font-size: 13px;
  padding: 20px;
  text-align: center;
}

.api-scenario-management__property-panel {
  display: grid;
  align-content: start;
  gap: 0;
  min-width: 0;
  background: #f9fafb;
  overflow-y: auto;
  padding: 0;
}

.api-scenario-management__property-section {
  display: grid;
  gap: 9px;
  min-width: 0;
  border-bottom: 1px solid var(--app-color-border);
  padding: 12px;
}

.api-scenario-management__property-section h5 {
  margin: 0;
  color: var(--app-color-text);
  font-size: 13px;
  font-weight: 650;
}

.api-scenario-management__property-panel header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  border-bottom: 1px solid var(--app-color-border);
  background: #ffffff;
  padding: 12px;
}

.api-scenario-management__property-panel header div {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.api-scenario-management__property-panel header strong {
  color: var(--app-color-text);
  font-size: 14px;
}

.api-scenario-management__property-panel header small {
  overflow: hidden;
  color: var(--app-color-text-muted);
  font-size: 12px;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-scenario-management__property-panel header span,
.api-scenario-management__property-panel label span {
  color: var(--app-color-text-muted);
  font-size: 12px;
}

.api-scenario-management__property-panel :deep(.arco-input-wrapper),
.api-scenario-management__property-panel :deep(.arco-select-view-single),
.api-scenario-management__property-panel :deep(.arco-textarea-wrapper) {
  min-height: 32px;
  border-radius: 6px;
  background: #ffffff;
}

.api-scenario-management__property-panel label {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.api-scenario-management__stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  min-width: 0;
}

.api-scenario-management__stat-grid span {
  display: grid;
  gap: 2px;
  min-width: 0;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: #ffffff;
  color: var(--app-color-text-muted);
  font-size: 12px;
  padding: 6px 8px;
}

.api-scenario-management__stat-grid strong {
  overflow: hidden;
  color: var(--app-color-text);
  font-size: 13px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-scenario-management__step-inspector {
  background: #ffffff;
}

.api-scenario-management__inspector-grid {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.api-scenario-management__inspector-grid span {
  display: grid;
  gap: 3px;
  min-width: 0;
  border: 1px solid var(--app-color-border);
  border-radius: 6px;
  background: #fbfcfe;
  color: var(--app-color-text-muted);
  font-size: 12px;
  padding: 7px 8px;
}

.api-scenario-management__inspector-grid strong {
  overflow: hidden;
  color: var(--app-color-text);
  font-size: 13px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-scenario-management__inspector-empty {
  min-height: 52px;
  align-content: center;
  border: 1px dashed var(--app-color-border);
  border-radius: 6px;
  background: #fbfcfe;
  color: var(--app-color-text-muted);
  display: grid;
  font-size: 12px;
  justify-items: center;
  padding: 10px;
  text-align: center;
}

.api-scenario-management__property-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  border-top: 1px solid var(--app-color-border);
  background: #ffffff;
  padding: 12px;
}

.api-scenario-management__run-result,
.api-scenario-management__history {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.api-scenario-management__history-table {
  display: grid;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
}

.api-scenario-management__history-head,
.api-scenario-management__history-row {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) 104px 104px;
  gap: 8px;
  align-items: center;
  min-width: 0;
  padding: 8px 10px;
}

.api-scenario-management__history-head {
  background: #f8fafc;
  color: var(--app-color-text-muted);
  font-size: 12px;
  font-weight: 650;
}

.api-scenario-management__history-row {
  border-top: 1px solid var(--app-color-border);
  background: #ffffff;
  color: var(--app-color-text-muted);
  font-size: 12px;
  min-height: 44px;
}

.api-scenario-management__history-row strong {
  overflow: hidden;
  color: var(--app-color-text);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-scenario-management__meta {
  overflow: hidden;
  border-radius: var(--app-radius-sm);
}

.api-scenario-management__drawer {
  gap: 12px;
}

.api-scenario-management__drawer-title {
  border-bottom: 1px solid var(--app-color-border);
  padding-bottom: 6px;
}

.api-scenario-management__list {
  gap: 0;
  overflow: hidden;
  border: 0;
  border-radius: 0;
}

.api-scenario-management__list-head,
.api-scenario-management__row {
  display: grid;
  grid-template-columns: 96px minmax(180px, 1fr) 96px 118px auto;
  gap: 10px;
  align-items: center;
  min-width: 0;
}

.api-scenario-management__list-head {
  background: #ffffff;
  color: var(--app-color-text-muted);
  font-size: 12px;
  font-weight: 600;
  min-height: 42px;
  padding: 7px 12px;
}

.api-scenario-management__row {
  border-top: 1px solid var(--app-color-border);
  background: var(--app-color-surface);
  min-height: 48px;
  padding: 7px 12px;
}

.api-scenario-management__row:hover {
  background: rgba(239, 246, 255, 0.42);
}

.api-scenario-management__row-id {
  color: rgb(var(--primary-6));
  font-size: 12px;
  font-weight: 600;
}

.api-scenario-management__row-main {
  display: grid;
  gap: 4px;
  min-width: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
}

.api-scenario-management__row-main strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-scenario-management__status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-width: 44px;
  height: 22px;
  border-radius: 4px;
  background: #e8efff;
  color: #3867d6;
  font-size: 12px;
  padding: 0 8px;
}

.api-scenario-management__result {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-scenario-management__module-row {
  position: relative;
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) auto;
  gap: 7px;
  align-items: center;
  min-height: 32px;
  border-color: transparent;
  border-radius: 7px;
  background: transparent;
  color: var(--app-color-text);
  cursor: pointer;
  padding: 6px 8px;
  text-align: left;
}

.api-scenario-management__module-row:hover {
  background: #f3f4f6;
}

.api-scenario-management__module-row--active {
  background: #eff6ff;
  color: rgb(var(--primary-6));
}

.api-scenario-management__module-row strong {
  overflow: hidden;
  font-size: 13px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-scenario-management__module-row small {
  color: inherit;
  font-size: 12px;
}

.api-scenario-management__module-row em {
  grid-column: 2 / -1;
  overflow: hidden;
  color: var(--app-color-text-muted);
  font-size: 11px;
  font-style: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-scenario-management__module-folder {
  width: 14px;
  height: 11px;
  border: 1px solid #9ca3af;
  border-radius: 2px;
  background: #f8fafc;
}

.api-scenario-management__step {
  position: relative;
  display: grid;
  gap: 6px;
  overflow: hidden;
  padding: 8px 10px 8px 13px;
}

.api-scenario-management__step::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 3px;
  background: #93c5fd;
}

.api-scenario-management__step--if-controller::before {
  background: #ec4899;
}

.api-scenario-management__step--loop-controller::before,
.api-scenario-management__step--once-only-controller::before {
  background: #f97316;
}

.api-scenario-management__step--constant-timer::before {
  background: #f59e0b;
}

.api-scenario-management__step--script::before {
  background: #14b8a6;
}

.api-scenario-management__step--group::before {
  background: #64748b;
}

.api-scenario-management__step-main {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--app-spacing-sm);
  min-width: 0;
}

.api-scenario-management__step-main strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-scenario-management__step-type {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  height: 22px;
  border: 1px solid #bfdbfe;
  border-radius: 4px;
  background: #eff6ff;
  color: rgb(var(--primary-6));
  font-size: 12px;
  line-height: 20px;
  padding: 0 7px;
}

.api-scenario-management__step-children {
  display: grid;
  gap: 6px;
  border-left: 2px solid rgba(var(--primary-6), 0.22);
  margin-left: 4px;
  padding-left: 10px;
}

@media (max-width: 720px) {
  .api-scenario-management__header,
  .api-scenario-management__row,
  .api-scenario-management__list-head {
    display: grid;
    grid-template-columns: 1fr;
  }

  .api-scenario-management__editor-workspace {
    grid-template-columns: 1fr;
  }

  .api-scenario-management__editor-main {
    border-right: 0;
    border-bottom: 1px solid var(--app-color-border);
  }

  .api-scenario-management__history-head,
  .api-scenario-management__history-row {
    grid-template-columns: 1fr;
  }

  .api-scenario-management__list-filters {
    width: 100%;
  }
}
</style>
