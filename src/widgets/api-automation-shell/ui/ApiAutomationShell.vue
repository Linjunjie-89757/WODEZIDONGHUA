<template>
  <AppSection
    :title="t.apiAutomation.overviewTitle"
    :description="t.apiAutomation.overviewDescription"
    class="api-automation-shell"
    data-testid="api-automation-shell"
  >
    <template #actions>
      <AppButton type="text" :loading="loading" @click="loadReadonly">
        {{ t.apiAutomation.retry }}
      </AppButton>
    </template>

    <AppLoadingState v-if="loading" />
    <a-alert v-else-if="errorMessage" type="error" show-icon>
      <template #title>{{ errorMessage }}</template>
      <AppButton type="text" @click="loadReadonly">{{ t.common.retry }}</AppButton>
    </a-alert>
    <div v-else class="api-automation-shell__workbench" data-testid="api-automation-workbench">
      <header class="api-automation-shell__toolbar">
        <div class="api-automation-shell__metrics" aria-label="api automation metrics">
          <span>{{ t.apiAutomation.definitionTotal }} <strong>{{ summary.definitionTotal }}</strong></span>
          <span>{{ t.apiAutomation.moduleTotal }} <strong>{{ summary.moduleTotal }}</strong></span>
          <span>{{ t.apiAutomation.environmentTotal }} <strong>{{ summary.environmentTotal }}</strong></span>
          <span>{{ t.apiAutomation.variableSetTotal }} <strong>{{ summary.variableSetTotal }}</strong></span>
        </div>
        <div class="api-automation-shell__context" data-testid="api-run-context-toolbar">
          <span class="api-automation-shell__context-label">{{ t.apiAutomation.runContextSection }}</span>
          <a-select
            v-model="selectedEnvironmentId"
            allow-clear
            data-testid="api-environment-select"
            :placeholder="t.apiAutomation.environmentDefault"
          >
            <a-option v-for="environment in environments" :key="environment.id" :value="environment.id">
              {{ environment.name }}
            </a-option>
          </a-select>
          <a-select
            v-model="selectedVariableSetId"
            allow-clear
            data-testid="api-variable-set-select"
            :placeholder="t.apiAutomation.variableSetDefault"
          >
            <a-option v-for="variableSet in variableSets" :key="variableSet.id" :value="variableSet.id">
              {{ variableSet.name }}
            </a-option>
          </a-select>
        </div>
      </header>

      <a-tabs
        v-model:active-key="activeWorkbenchTab"
        class="api-automation-shell__tabs"
        data-testid="api-automation-workbench-tabs"
      >
        <a-tab-pane key="definitions" :title="t.apiAutomation.workbenchTabDefinitions">
          <div class="api-automation-shell__definition-workbench">
            <aside class="api-automation-shell__rail">
              <section class="api-automation-shell__panel">
                <div class="api-automation-shell__panel-header">
                  <h3 class="api-automation-shell__panel-title">{{ t.apiAutomation.modulesSection }}</h3>
                  <span>{{ summary.moduleTotal }}</span>
                </div>
                <ApiDefinitionModuleTree :modules="definitionModules" />
              </section>
            </aside>

            <main class="api-automation-shell__editor">
              <section class="api-automation-shell__panel api-automation-shell__definition-list-panel">
                <header class="api-automation-shell__panel-header">
                  <div>
                    <h3 class="api-automation-shell__panel-title">{{ t.apiAutomation.definitionsSection }}</h3>
                    <p>{{ t.apiAutomation.definitionWorkbenchHint }}</p>
                  </div>
                  <AppButton type="primary" data-testid="api-definition-create" @click="openCreateDialog">
                    {{ t.apiAutomation.create }}
                  </AppButton>
                </header>
                <ApiDefinitionList
                  :definitions="definitions"
                  :selected-id="selectedDefinitionId"
                  @select="selectDefinition"
                  @edit="openEditDialog"
                  @success="loadReadonly"
                />
              </section>

              <section class="api-automation-shell__panel api-automation-shell__debug-panel">
                <ApiDefinitionDebugPanel
                  :definition-id="selectedDefinitionId"
                  :selected-definition-name="selectedDefinition?.name || ''"
                  :environment-id="selectedEnvironmentId"
                  :variable-set-id="selectedVariableSetId"
                  @result="definitionRunResult = $event"
                />
                <ApiRunResultPanel v-if="definitionRunResult" :result="definitionRunResult" />
              </section>
            </main>
          </div>
        </a-tab-pane>

        <a-tab-pane key="cases" :title="t.apiAutomation.workbenchTabCases">
          <section class="api-automation-shell__tab-surface" data-testid="api-automation-cases-tab">
            <ApiCaseManagement
              :definition-id="selectedDefinitionId"
              :selected-definition-name="selectedDefinition?.name || ''"
              :environment-id="selectedEnvironmentId"
              :variable-set-id="selectedVariableSetId"
            />
          </section>
        </a-tab-pane>

        <a-tab-pane key="scenarios" :title="t.apiAutomation.workbenchTabScenarios">
          <section class="api-automation-shell__tab-surface" data-testid="api-automation-scenarios-tab">
            <ApiScenarioManagement
              :definitions="definitions"
              :environment-id="selectedEnvironmentId"
              :variable-set-id="selectedVariableSetId"
            />
          </section>
        </a-tab-pane>
      </a-tabs>
    </div>
    <ApiDefinitionDialog
      ref="definitionDialogRef"
      :mode="dialogMode"
      :definition-id="editingDefinitionId"
      @success="loadReadonly"
    />
  </AppSection>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue';

import type { ApiRunResponse } from '@entities/api-automation';
import { ApiDefinitionDebugPanel } from '@features/api-definition-debug';
import { ApiDefinitionDialog } from '@features/api-definition-save';
import { t } from '@shared/i18n';
import { AppButton, AppLoadingState, AppSection } from '@shared/ui';
import { ApiCaseManagement } from '@widgets/api-case-management';
import { ApiRunResultPanel } from '@widgets/api-run-result-panel';
import { ApiScenarioManagement } from '@widgets/api-scenario-management';

import { useApiAutomationShell } from '../model/useApiAutomationShell';
import ApiDefinitionList from './ApiDefinitionList.vue';
import ApiDefinitionModuleTree from './ApiDefinitionModuleTree.vue';

const {
  loading,
  errorMessage,
  definitions,
  definitionModules,
  environments,
  variableSets,
  selectedDefinition,
  selectedDefinitionId,
  selectedEnvironmentId,
  selectedVariableSetId,
  summary,
  loadReadonly,
  selectDefinition
} = useApiAutomationShell();

const dialogMode = ref<'create' | 'edit'>('create');
const activeWorkbenchTab = ref('definitions');
const editingDefinitionId = ref<number | null>(null);
const definitionRunResult = ref<ApiRunResponse | null>(null);
const definitionDialogRef = ref<{
  openCreate: () => void;
  openEdit: () => void | Promise<void>;
} | null>(null);

async function openCreateDialog() {
  dialogMode.value = 'create';
  editingDefinitionId.value = null;
  await nextTick();
  definitionDialogRef.value?.openCreate();
}

async function openEditDialog(id: number) {
  dialogMode.value = 'edit';
  editingDefinitionId.value = id;
  await nextTick();
  await definitionDialogRef.value?.openEdit();
}
</script>

<style scoped>
.api-automation-shell :deep(.app-section__header) {
  align-items: center;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-md);
  background: var(--app-color-surface);
  padding: 10px 12px;
}

.api-automation-shell :deep(.app-section__title) {
  font-size: 16px;
}

.api-automation-shell :deep(.app-section__description) {
  margin-top: 2px;
  font-size: 13px;
  line-height: 1.45;
}

.api-automation-shell__workbench {
  display: grid;
  min-width: 0;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-md);
  background: var(--app-color-surface);
  overflow: hidden;
}

.api-automation-shell__toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(420px, 560px);
  gap: 12px;
  align-items: center;
  min-width: 0;
  border-bottom: 1px solid var(--app-color-border);
  background: #f8fafc;
  padding: 10px 12px;
}

.api-automation-shell__metrics {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}

.api-automation-shell__metrics span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: #ffffff;
  color: var(--app-color-text-muted);
  font-size: 12px;
  padding: 0 9px;
}

.api-automation-shell__metrics strong {
  color: var(--app-color-text);
  font-size: 13px;
  font-weight: 650;
}

.api-automation-shell__context {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) minmax(0, 1fr);
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.api-automation-shell__context-label {
  color: var(--app-color-text-muted);
  font-size: 12px;
  white-space: nowrap;
}

.api-automation-shell__context :deep(.arco-select-view-single) {
  min-height: 30px;
}

.api-automation-shell__tabs :deep(.arco-tabs-nav) {
  margin: 0;
  border-bottom: 1px solid var(--app-color-border);
  padding: 0 12px;
}

.api-automation-shell__tabs :deep(.arco-tabs-tab) {
  height: 40px;
  margin: 0;
  padding: 0 14px;
}

.api-automation-shell__tabs :deep(.arco-tabs-content) {
  padding-top: 0;
}

.api-automation-shell__definition-workbench {
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  min-width: 0;
  min-height: 620px;
}

.api-automation-shell__rail {
  min-width: 0;
  border-right: 1px solid var(--app-color-border);
  background: #fbfcfe;
  padding: 10px;
}

.api-automation-shell__editor {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 0;
  min-width: 0;
}

.api-automation-shell__tab-surface {
  min-width: 0;
  min-height: 620px;
  padding: 12px;
}

.api-automation-shell__panel {
  display: grid;
  gap: 10px;
  min-width: 0;
  padding: 10px;
}

.api-automation-shell__definition-list-panel {
  border-bottom: 1px solid var(--app-color-border);
}

.api-automation-shell__debug-panel {
  align-content: start;
  background: #ffffff;
}

.api-automation-shell__panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--app-spacing-sm);
  min-width: 0;
}

.api-automation-shell__panel-header span {
  color: var(--app-color-text-muted);
  font-size: 12px;
}

.api-automation-shell__panel-title {
  margin: 0;
  color: var(--app-color-text);
  font-size: 15px;
  font-weight: 650;
  line-height: 1.4;
}

.api-automation-shell__panel-header p {
  margin: 2px 0 0;
  color: var(--app-color-text-muted);
  font-size: 12px;
}

@media (max-width: 1024px) {
  .api-automation-shell__toolbar,
  .api-automation-shell__definition-workbench {
    grid-template-columns: 1fr;
  }

  .api-automation-shell__rail {
    border-right: 0;
    border-bottom: 1px solid var(--app-color-border);
  }
}

@media (max-width: 720px) {
  .api-automation-shell__context {
    grid-template-columns: 1fr;
  }
}
</style>
