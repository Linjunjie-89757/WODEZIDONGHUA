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
        <section class="api-scenario-management__panel api-scenario-management__module-pane">
          <h4>{{ t.apiAutomation.scenarioModules }}</h4>
          <div v-if="!modules.length" class="api-scenario-management__empty">
            {{ t.apiAutomation.scenarioModuleEmpty }}
          </div>
          <div v-else class="api-scenario-management__modules" data-testid="api-scenario-modules">
            <article v-for="module in modules" :key="module.id">
              <strong>{{ module.name }}</strong>
              <small>{{ module.fullPath }}</small>
            </article>
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
                <h4>{{ t.apiAutomation.scenarioList }}</h4>
                <span>{{ scenarios.length }}</span>
              </div>
              <AppLoadingState v-if="loading" />
              <div v-else-if="!scenarios.length" class="api-scenario-management__empty">
                {{ t.apiAutomation.scenarioEmpty }}
              </div>
              <div v-else class="api-scenario-management__list" data-testid="api-scenario-list">
                <div class="api-scenario-management__list-head">
                  <span>{{ t.apiAutomation.scenarioName }}</span>
                  <span>{{ t.apiAutomation.fieldStatus }}</span>
                  <span>{{ t.apiAutomation.lastRunResult }}</span>
                  <span></span>
                </div>
                <article
                  v-for="scenario in scenarios"
                  :key="scenario.id"
                  class="api-scenario-management__row"
                  data-testid="api-scenario-row"
                  @click="selectScenario(scenario.id)"
                >
                  <button type="button" class="api-scenario-management__row-main" @click.stop="selectScenario(scenario.id)">
                    <strong>{{ scenario.name }}</strong>
                  </button>
                  <small>{{ scenario.status || '-' }}</small>
                  <small>{{ scenario.lastRunResult || '-' }}</small>
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
                  <a-tab-pane key="history" :title="t.apiAutomation.scenarioHistory">
                    <div class="api-scenario-management__editor-placeholder">
                      {{ t.apiAutomation.scenarioEditorHistoryHint }}
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
                <strong>{{ t.apiAutomation.scenarioPropertyPanel }}</strong>
                <span>{{ editingScenarioId || '-' }}</span>
              </header>
              <template v-if="editingScenarioForm">
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
                <div class="api-scenario-management__property-actions">
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
                    :environment-id="environmentId"
                    :variable-set-id="variableSetId"
                    @success="setRunResult"
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
import { defineComponent, h, nextTick, ref, watch } from 'vue';

import {
  apiAutomationApi,
  createScenarioEditForm,
  type ApiDefinitionItem,
  type ApiScenarioFormValues,
  type ApiScenarioStep
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
const scenarioDialogRef = ref<{
  openCreate: () => void;
  openEdit: () => void | Promise<void>;
} | null>(null);

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

watch(selectedScenarioDetail, (value) => {
  detailVisible.value = !!value;
});

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
      h('article', { class: 'api-scenario-management__step' }, [
        h('div', { class: 'api-scenario-management__step-main' }, [
          h('strong', stepProps.step.name || typeLabel(stepProps.step.stepType)),
          h('small', typeLabel(stepProps.step.stepType))
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
.api-scenario-management__modules article,
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
  min-height: 100%;
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
  background: #f8fafc;
}

.api-scenario-management__editor-tab,
.api-scenario-management__tab-add {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  min-width: 0;
  border: 0;
  border-right: 1px solid var(--app-color-border);
  background: transparent;
  color: var(--app-color-text-muted);
  cursor: pointer;
  font-size: 13px;
  padding: 0 12px;
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
  padding: 10px;
}

.api-scenario-management__list-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-spacing-sm);
}

.api-scenario-management__list-toolbar span {
  color: var(--app-color-text-muted);
  font-size: 12px;
}

.api-scenario-management__editor-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  min-width: 0;
  min-height: 620px;
}

.api-scenario-management__editor-main {
  min-width: 0;
  border-right: 1px solid var(--app-color-border);
  padding: 10px;
}

.api-scenario-management__detail-tabs :deep(.arco-tabs-nav) {
  margin: 0;
}

.api-scenario-management__detail-tabs :deep(.arco-tabs-tab) {
  height: 36px;
  margin: 0;
  padding: 0 12px;
}

.api-scenario-management__detail-tabs :deep(.arco-tabs-content) {
  padding-top: 10px;
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
  gap: 12px;
  min-width: 0;
  background: #fbfcfe;
  padding: 12px;
}

.api-scenario-management__property-panel header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-bottom: 1px solid var(--app-color-border);
  padding-bottom: 8px;
}

.api-scenario-management__property-panel header strong {
  color: var(--app-color-text);
  font-size: 14px;
}

.api-scenario-management__property-panel header span,
.api-scenario-management__property-panel label span {
  color: var(--app-color-text-muted);
  font-size: 12px;
}

.api-scenario-management__property-panel label {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.api-scenario-management__property-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
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
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
}

.api-scenario-management__list-head,
.api-scenario-management__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 120px 120px auto;
  gap: var(--app-spacing-sm);
  align-items: center;
  min-width: 0;
}

.api-scenario-management__list-head {
  background: #f8fafc;
  color: var(--app-color-text-muted);
  font-size: 12px;
  font-weight: 600;
  padding: 7px 10px;
}

.api-scenario-management__row {
  border-top: 1px solid var(--app-color-border);
  background: var(--app-color-surface);
  padding: 8px 10px;
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

.api-scenario-management__step {
  display: grid;
  gap: 6px;
  padding: 8px 10px;
}

.api-scenario-management__step-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-spacing-sm);
  min-width: 0;
}

.api-scenario-management__step-main strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
}
</style>
