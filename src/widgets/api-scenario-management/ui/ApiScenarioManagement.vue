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

    <div class="scenario-workbench ms-scenario-workbench">
        <section
          class="scenario-module-pane api-scenario-management__module-pane"
          data-testid="api-scenario-module-rail"
        >
          <div class="ms-like-sidebar-tools api-scenario-management__module-tools">
            <AppButton
              type="primary"
              class="scenario-sidebar-primary"
              data-testid="api-scenario-rail-create"
              @click="openCreateDialog"
            >
              {{ t.apiAutomation.scenarioCreate }}
            </AppButton>
            <a-input
              v-model="moduleKeyword"
              class="scenario-sidebar-search"
              allow-clear
              data-testid="api-scenario-module-search"
              :placeholder="t.apiAutomation.scenarioModuleSearchPlaceholder"
            />
          </div>
          <div class="ms-like-directory-shell">
            <div class="scenario-directory-title-row api-scenario-management__module-title">
              <div class="scenario-directory-title-main">
                <span>{{ t.apiAutomation.scenarioModules }}</span>
                <small>{{ scenarios.length }}</small>
              </div>
              <div class="scenario-directory-title-actions">
                <button type="button" class="scenario-directory-collapse-button">-</button>
              </div>
            </div>
            <div class="scenario-module-tree api-scenario-management__modules" data-testid="api-scenario-modules">
              <button
                type="button"
                class="ms-like-directory-node api-scenario-management__module-row api-scenario-management__module-row--active"
                data-testid="api-scenario-module-row"
              >
                <div class="ms-like-directory-main">
                  <span class="tree-node-folder-svg is-open api-scenario-management__module-folder"></span>
                  <strong class="ms-like-directory-label">{{ t.apiAutomation.scenarioModuleAll }}</strong>
                  <small class="ms-like-directory-count">{{ scenarios.length }}</small>
                </div>
              </button>
              <button
                v-for="module in filteredModules"
                :key="module.id"
                type="button"
                class="ms-like-directory-node api-scenario-management__module-row"
                data-testid="api-scenario-module-row"
              >
                <div class="ms-like-directory-main">
                  <span class="tree-node-folder-svg api-scenario-management__module-folder"></span>
                  <strong class="ms-like-directory-label">{{ module.name }}</strong>
                  <small class="ms-like-directory-count">{{ module.scenarioCount ?? 0 }}</small>
                </div>
                <em>{{ module.fullPath }}</em>
              </button>
              <div v-if="modules.length && !filteredModules.length" class="api-scenario-management__empty">
                {{ t.apiAutomation.scenarioModuleEmpty }}
              </div>
            </div>
          </div>
        </section>
      <main class="scenario-main-pane api-scenario-management__workbench" data-testid="api-scenario-workbench">
          <div class="ms-like-tab-strip scenario-editor-tab-strip api-scenario-management__editor-tabs" data-testid="api-scenario-editor-tabs">
            <div class="ms-like-tab-strip-main">
              <div class="ms-like-tab-nav">
                <button
                  type="button"
                  :class="[
                    'ms-like-editor-tab',
                    'api-scenario-management__editor-tab',
                    { active: activeEditorTab === 'list', 'api-scenario-management__editor-tab--active': activeEditorTab === 'list' }
                  ]"
                  data-testid="api-scenario-list-editor-tab"
                  @click="activeEditorTab = 'list'"
                >
                  <span class="ms-like-editor-tab-label">{{ t.apiAutomation.scenarioList }}</span>
                </button>
                <button
                  v-if="editingScenarioForm"
                  type="button"
                  :class="[
                    'ms-like-editor-tab',
                    'api-scenario-management__editor-tab',
                    { active: activeEditorTab === 'editor', 'api-scenario-management__editor-tab--active': activeEditorTab === 'editor' }
                  ]"
                  data-testid="api-scenario-editor-tab"
                  @click="activeEditorTab = 'editor'"
                >
                  <span class="ms-like-editor-tab-label">
                    {{ editingScenarioForm.name || t.apiAutomation.scenarioEditTitle }}
                  </span>
                  <span class="ms-like-editor-tab-dot api-scenario-management__dirty-dot"></span>
                </button>
              </div>
              <button type="button" class="ms-like-tab-add api-scenario-management__tab-add" @click="openCreateDialog">
                +
              </button>
            </div>
          </div>

          <div v-if="activeEditorTab === 'list'" class="ms-scenario-list-shell api-scenario-management__list-workspace">
              <div class="ms-scenario-list-toolbar api-scenario-management__list-toolbar">
                <div class="ms-scenario-search api-scenario-management__list-filters">
                  <a-input
                    v-model="scenarioKeyword"
                    allow-clear
                    data-testid="api-scenario-list-search"
                    :placeholder="t.apiAutomation.scenarioListSearchPlaceholder"
                  />
                </div>
                <a-select class="ms-scenario-view-select" :model-value="'ALL'">
                  <a-option value="ALL">{{ t.apiAutomation.scenarioModuleAll }}</a-option>
                </a-select>
                <AppButton type="text" class="ms-scenario-tool-button">{{ t.apiAutomation.scenarioFilter }}</AppButton>
                <AppButton
                  type="text"
                  class="ms-scenario-icon-button"
                  :loading="loading"
                  data-testid="api-scenario-list-refresh"
                  @click="loadScenarios"
                >
                  ↻
                </AppButton>
              </div>
              <AppLoadingState v-if="loading" />
              <div v-else-if="!filteredScenarios.length" class="api-scenario-management__empty">
                {{ t.apiAutomation.scenarioEmpty }}
              </div>
              <div v-else class="scenario-table ms-scenario-table api-scenario-management__list" data-testid="api-scenario-list">
                <div class="api-scenario-management__list-head">
                  <span></span>
                  <span>ID</span>
                  <span>{{ t.apiAutomation.scenarioName }}</span>
                  <span>{{ t.apiAutomation.scenarioPriority }}</span>
                  <span>{{ t.apiAutomation.fieldStatus }}</span>
                  <span>{{ t.apiAutomation.lastRunResult }}</span>
                  <span>{{ t.apiAutomation.scenarioTags }}</span>
                  <span>{{ t.common.actions }}</span>
                </div>
                <article
                  v-for="scenario in filteredScenarios"
                  :key="scenario.id"
                  class="api-scenario-management__row"
                  data-testid="api-scenario-row"
                  @click="selectScenario(scenario.id)"
                >
                  <span class="api-scenario-management__selection-cell"></span>
                  <button type="button" class="scenario-link api-scenario-management__row-id" @click.stop="selectScenario(scenario.id)">
                    {{ 100000 + scenario.id }}
                  </button>
                  <button type="button" class="ms-scenario-name-link api-scenario-management__row-main" @click.stop="selectScenario(scenario.id)">
                    {{ scenario.name }}
                  </button>
                  <span class="ms-scenario-priority"><i></i>P1</span>
                  <small class="ms-scenario-status api-scenario-management__status">{{ scenarioStatusLabel(scenario.status) }}</small>
                  <small class="api-scenario-management__result">{{ scenario.lastRunResult || '-' }}</small>
                  <small>{{ scenario.moduleName || '-' }}</small>
                  <div class="api-scenario-management__row-actions" @click.stop>
                    <ApiScenarioRunButton
                      :scenario-id="scenario.id"
                      :environment-id="environmentId"
                      :variable-set-id="variableSetId"
                      @success="setRunResult"
                    />
                    <AppButton type="text" class="ms-scenario-action" data-testid="api-scenario-edit" @click="openEditorWorkspace(scenario.id)">
                      {{ t.common.edit }}
                    </AppButton>
                    <ApiScenarioDeleteButton :scenario-id="scenario.id" @success="loadScenarios" />
                  </div>
                </article>
              </div>
              <div class="ms-scenario-pagination">
                <span>{{ t.apiAutomation.scenarioListTotal.replace('{count}', String(filteredScenarios.length)) }}</span>
                <button type="button">‹</button>
                <span class="ms-scenario-page-current">1</span>
                <button type="button">›</button>
              </div>
          </div>

          <div v-else class="scenario-edit-workspace api-scenario-management__editor-workspace" data-testid="api-scenario-editor-workspace">
            <section class="scenario-edit-main api-scenario-management__editor-main">
              <a-spin :loading="editorLoading">
                <a-tabs
                  v-model:active-key="activeScenarioDetailTab"
                  class="scenario-detail-tabs api-scenario-management__detail-tabs"
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

            <aside class="scenario-property-panel api-scenario-management__property-panel" data-testid="api-scenario-property-panel">
              <div class="scenario-property-card">
                <div class="scenario-property-header">
                  <a-select
                    v-if="editingScenarioForm"
                    v-model="editingScenarioForm.environmentId"
                    class="scenario-property-environment-select"
                    allow-clear
                    :placeholder="t.apiAutomation.environmentDefault"
                  >
                    <a-option v-for="environment in environments" :key="environment.id" :value="environment.id">
                      {{ environment.name }}
                    </a-option>
                  </a-select>
                  <div class="scenario-property-run-actions api-scenario-management__property-actions" data-testid="api-scenario-property-actions">
                    <AppButton
                      type="primary"
                      class="scenario-property-save-button"
                      :loading="saving"
                      data-testid="api-scenario-workbench-save"
                      @click="saveEditorWorkspace"
                    >
                      {{ t.apiAutomation.save }}
                    </AppButton>
                    <ApiScenarioRunButton
                      v-if="editingScenarioId && editingScenarioForm"
                      :scenario-id="editingScenarioId"
                      :environment-id="editingScenarioForm.environmentId ?? environmentId"
                      :variable-set-id="editingScenarioForm.variableSetId ?? variableSetId"
                      @success="handleWorkbenchRunSuccess"
                    />
                  </div>
                </div>
                <div v-if="editingScenarioForm" class="scenario-property-body">
                  <label class="scenario-property-field">
                    <span><b>*</b> {{ t.apiAutomation.scenarioName }}</span>
                    <a-input
                      v-model="editingScenarioForm.name"
                      data-testid="api-scenario-workbench-name-input"
                      :placeholder="t.apiAutomation.scenarioNamePlaceholder"
                    />
                  </label>
                  <label class="scenario-property-field">
                    <span>{{ t.apiAutomation.fieldStatus }}</span>
                    <a-select v-model="editingScenarioForm.status">
                      <a-option value="ACTIVE">{{ t.apiAutomation.scenarioStatusActive }}</a-option>
                      <a-option value="DISABLED">{{ t.apiAutomation.scenarioStatusDisabled }}</a-option>
                    </a-select>
                  </label>
                  <label class="scenario-property-field">
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
                  <label class="scenario-property-field">
                    <span>{{ t.apiAutomation.fieldDescription }}</span>
                    <a-textarea
                      v-model="editingScenarioForm.description"
                      :auto-size="{ minRows: 3, maxRows: 5 }"
                      :placeholder="t.apiAutomation.fieldDescriptionPlaceholder"
                    />
                  </label>

                  <section class="api-scenario-management__property-section" data-testid="api-scenario-property-run-context">
                    <h5>{{ t.apiAutomation.runContextSection }}</h5>
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
                </div>
              </div>
            </aside>
          </div>
      </main>
    </div>

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
.api-scenario-management__drawer,
.api-scenario-management__steps {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.api-scenario-management {
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 0;
  background: #fff;
}

.api-scenario-management__header {
  display: none;
}

.scenario-workbench {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  min-height: calc(100vh - 188px);
  overflow: hidden;
  background: #fff;
}

.ms-scenario-workbench {
  border: 0;
  border-radius: 0;
  background: #fff;
  box-shadow: none;
}

.scenario-module-pane {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
  min-height: 0;
  padding: 0;
  border-right: 1px solid #e5e7eb;
  background: #fff;
}

.scenario-module-pane .ms-like-sidebar-tools {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  padding: 16px 16px 12px;
}

.scenario-sidebar-primary {
  width: 100%;
  height: 36px;
  min-height: 36px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
}

.scenario-sidebar-search {
  display: block;
  width: 100%;
}

.scenario-sidebar-search :deep(.arco-input-wrapper) {
  width: 100%;
  height: 36px;
  min-height: 36px;
  border-radius: 8px;
  background: #fff;
}

.scenario-module-pane .ms-like-directory-shell {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  padding: 0 12px 12px;
}

.scenario-directory-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
  margin: 0 -4px 8px;
  padding: 0 8px;
  border-bottom: 1px solid #e5e7eb;
  color: #303640;
  font-size: 14px;
  font-weight: 600;
}

.scenario-directory-title-main,
.scenario-directory-title-actions,
.ms-like-directory-main {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: 8px;
}

.scenario-directory-title-main small {
  color: #98a2b3;
  font-size: 12px;
  font-weight: 500;
}

.scenario-directory-collapse-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #98a2b3;
  cursor: pointer;
}

.scenario-directory-collapse-button:hover {
  background: #f3f4f6;
  color: #2563eb;
}

.scenario-module-tree {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
}

.ms-like-directory-node {
  display: flex;
  justify-content: space-between;
  width: 100%;
  min-height: 32px;
  min-width: 0;
  gap: 8px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #374151;
  cursor: pointer;
  padding: 0 8px;
  text-align: left;
}

.ms-like-directory-node:hover {
  background: #f3f4f6;
}

.api-scenario-management__module-row--active {
  background: #eff6ff;
  color: #2563eb;
}

.ms-like-directory-label {
  min-width: 0;
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ms-like-directory-count {
  margin-left: auto;
  color: #98a2b3;
  font-size: 12px;
}

.api-scenario-management__module-row em {
  display: none;
}

.api-scenario-management__module-folder {
  flex: 0 0 auto;
  width: 14px;
  height: 12px;
  border: 1px solid #8b8f9a;
  border-radius: 2px;
  background: #f8fafc;
}

.scenario-main-pane {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: #fff;
}

.scenario-editor-tab-strip {
  min-height: 40px;
  padding: 0;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
}

.scenario-editor-tab-strip .ms-like-tab-strip-main {
  display: flex;
  align-items: center;
  min-height: 40px;
}

.ms-like-tab-nav {
  display: flex;
  min-width: 0;
  flex: 1;
}

.scenario-editor-tab-strip .ms-like-editor-tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 280px;
  height: 40px;
  min-width: 0;
  padding: 0 16px;
  border: 0;
  border-right: 1px solid #e5e7eb;
  border-radius: 0;
  background: #f9fafb;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
}

.scenario-editor-tab-strip .ms-like-editor-tab.active {
  background: #fff;
  color: #111827;
  font-weight: 500;
}

.scenario-editor-tab-strip .ms-like-editor-tab.active::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  background: #3b82f6;
}

.ms-like-editor-tab-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ms-like-editor-tab-dot {
  flex: 0 0 auto;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #3b82f6;
}

.scenario-editor-tab-strip .ms-like-tab-add {
  width: 32px;
  height: 39px;
  border: 0;
  border-left: 1px solid #e5e7eb;
  border-radius: 0;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  font-size: 18px;
}

.scenario-editor-tab-strip .ms-like-tab-add:hover {
  background: #f3f4f6;
  color: #4b5563;
}

.ms-scenario-list-shell {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 270px);
  flex-direction: column;
  background: #fff;
}

.ms-scenario-list-toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px;
}

.ms-scenario-search {
  width: 223px;
}

.ms-scenario-search :deep(.arco-input-wrapper) {
  height: 36px;
  min-height: 36px;
  border-radius: 8px;
  background: #fff;
}

.ms-scenario-view-select {
  width: 150px;
}

.ms-scenario-view-select :deep(.arco-select-view-single) {
  height: 36px;
  min-height: 36px;
  border-radius: 8px;
}

.ms-scenario-tool-button,
.ms-scenario-icon-button {
  height: 32px;
  border-radius: 4px;
}

.ms-scenario-icon-button {
  width: 34px;
  padding: 0;
}

.scenario-table {
  width: 100%;
}

.ms-scenario-table {
  display: grid;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.api-scenario-management__list-head,
.api-scenario-management__row {
  display: grid;
  grid-template-columns: 44px 120px minmax(180px, 1fr) 120px 120px 140px minmax(120px, 1fr) 210px;
  align-items: center;
  min-width: 0;
}

.api-scenario-management__list-head {
  min-height: 44px;
  border-top: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
  background: #fff;
  color: #4f5663;
  font-size: 13px;
  font-weight: 500;
}

.api-scenario-management__list-head span,
.api-scenario-management__row > span,
.api-scenario-management__row > small,
.api-scenario-management__row > button,
.api-scenario-management__row-actions {
  min-width: 0;
  padding: 0 12px;
}

.api-scenario-management__row {
  min-height: 48px;
  border-bottom: 1px solid #f3f4f6;
  background: #fff;
  color: #303640;
  font-size: 13px;
}

.api-scenario-management__row:hover {
  background: rgba(239, 246, 255, 0.42);
}

.api-scenario-management__selection-cell::before {
  content: "";
  display: block;
  width: 14px;
  height: 14px;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  background: #fff;
}

.scenario-link {
  overflow: hidden;
  border: 0;
  background: transparent;
  color: #2563eb;
  cursor: pointer;
  font-size: 13px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ms-scenario-name-link {
  overflow: hidden;
  border: 0;
  background: transparent;
  color: #303640;
  cursor: pointer;
  font-size: 13px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ms-scenario-name-link:hover {
  color: #2563eb;
}

.ms-scenario-priority {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.ms-scenario-priority i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ef4444;
}

.ms-scenario-status {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  height: 24px;
  padding: 0 8px;
  border-radius: 4px;
  background: #e8efff;
  color: #3867d6;
  font-size: 12px;
}

.api-scenario-management__result {
  overflow: hidden;
  color: #667085;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-scenario-management__row-actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
}

.api-scenario-management__row-actions :deep(.arco-btn),
.ms-scenario-action {
  height: 28px;
  margin-right: 0;
  border: 0;
  background: transparent;
  color: #2563eb;
  cursor: pointer;
  font-size: 13px;
  padding: 0 4px;
}

.ms-scenario-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  padding: 16px;
  color: #303640;
  font-size: 13px;
}

.ms-scenario-pagination button,
.ms-scenario-page-current {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  border: 1px solid #dbeafe;
  border-radius: 4px;
  background: #fff;
  color: #2563eb;
}

.scenario-edit-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 288px;
  flex: 1;
  min-height: 0;
  background: #fff;
}

.scenario-edit-main {
  min-width: 0;
  min-height: 0;
  border-right: 1px solid #e5e7eb;
}

.scenario-detail-tabs {
  height: 100%;
}

.scenario-detail-tabs :deep(.arco-tabs-nav) {
  display: block;
  margin: 0;
  padding: 0 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
}

.scenario-detail-tabs :deep(.arco-tabs-nav-tab-list) {
  display: flex;
  align-items: center;
  gap: 20px;
  height: 40px;
}

.scenario-detail-tabs :deep(.arco-tabs-tab) {
  position: relative;
  height: 40px;
  margin: 0;
  padding: 0;
  color: #4b5563;
  font-size: 14px;
  line-height: 40px;
}

.scenario-detail-tabs :deep(.arco-tabs-tab:hover),
.scenario-detail-tabs :deep(.arco-tabs-tab-active) {
  color: #2563eb;
  font-weight: 500;
}

.scenario-detail-tabs :deep(.arco-tabs-nav-ink) {
  height: 2px;
  border-radius: 999px;
  background: #2563eb;
}

.scenario-detail-tabs :deep(.arco-tabs-content) {
  height: calc(100% - 40px);
  overflow: hidden;
  padding: 0;
  background: #fff;
}

.scenario-detail-tabs :deep(.arco-tabs-content-item) {
  height: 100%;
  overflow: hidden;
}

.scenario-property-panel {
  display: flex;
  min-height: 0;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
  padding: 12px;
  background: #fff;
}

.scenario-property-card {
  display: flex;
  flex: 1 1 auto;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #f9fafb;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.scenario-property-header {
  display: grid;
  gap: 10px;
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.scenario-property-environment-select {
  width: 100%;
}

.scenario-property-environment-select :deep(.arco-select-view-single),
.scenario-property-field :deep(.arco-input-wrapper),
.scenario-property-field :deep(.arco-select-view-single),
.scenario-property-field :deep(.arco-textarea-wrapper) {
  min-height: 36px;
  border-radius: 8px;
  background: #fff;
}

.scenario-property-run-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  border-top: 0;
  background: transparent;
  padding: 0;
}

.scenario-property-run-actions :deep(.arco-btn) {
  height: 36px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
}

.scenario-property-body {
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding: 12px 12px 16px;
}

.scenario-property-field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
}

.scenario-property-field b {
  color: #ef4444;
  font-weight: 600;
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

/* Phase V1: old-project scenario workbench visual migration overrides. */
.api-scenario-management .api-scenario-management__property-panel.scenario-property-panel {
  display: flex;
  overflow: hidden;
  padding: 12px;
  background: #fff;
}

.api-scenario-management .scenario-property-card {
  display: flex;
}

.api-scenario-management .scenario-property-run-actions.api-scenario-management__property-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  border-top: 0;
  background: transparent;
  padding: 0;
}

.api-scenario-management .scenario-property-field {
  display: flex;
}

.api-scenario-management .scenario-property-field :deep(.arco-input-wrapper),
.api-scenario-management .scenario-property-field :deep(.arco-select-view-single),
.api-scenario-management .scenario-property-field :deep(.arco-textarea-wrapper) {
  min-height: 36px;
  border-radius: 8px;
  background: #fff;
}

.api-scenario-management .api-scenario-management__property-section {
  display: grid;
  gap: 8px;
  border-bottom: 0;
  padding: 0;
}

.api-scenario-management .api-scenario-management__property-section h5 {
  margin: 0;
  color: #303640;
  font-size: 13px;
  font-weight: 600;
}

.api-scenario-management .api-scenario-management__stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.api-scenario-management .api-scenario-management__stat-grid span,
.api-scenario-management .api-scenario-management__inspector-grid span {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  color: #6b7280;
  font-size: 12px;
  padding: 7px 8px;
}

.api-scenario-management .api-scenario-management__list-head,
.api-scenario-management .api-scenario-management__row {
  grid-template-columns: 44px 120px minmax(180px, 1fr) 120px 120px 140px minmax(120px, 1fr) 210px;
  gap: 0;
  padding: 0;
}

.api-scenario-management .api-scenario-management__list-head {
  min-height: 44px;
  color: #4f5663;
  font-size: 13px;
  font-weight: 500;
}

.api-scenario-management .api-scenario-management__row {
  min-height: 48px;
  border-top: 0;
  border-bottom: 1px solid #f3f4f6;
  background: #fff;
}

.api-scenario-management .api-scenario-management__row:hover {
  background: rgba(239, 246, 255, 0.42);
}

.api-scenario-management .api-scenario-management__row-id {
  color: #2563eb;
  font-size: 13px;
  font-weight: 400;
}

.api-scenario-management .api-scenario-management__module-row {
  display: flex;
  min-height: 32px;
  border: 0;
  border-radius: 8px;
  padding: 0 8px;
}

.api-scenario-management .api-scenario-management__module-row--active {
  background: #eff6ff;
  color: #2563eb;
}

.api-scenario-management .api-scenario-management__module-folder {
  width: 14px;
  height: 12px;
  border-color: #8b8f9a;
}

.api-scenario-management .api-scenario-management__module-row em {
  display: none;
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
