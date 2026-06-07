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

    <div class="api-automation-shell__summary">
      <a-statistic :title="t.apiAutomation.definitionTotal" :value="summary.definitionTotal" />
      <a-statistic :title="t.apiAutomation.moduleTotal" :value="summary.moduleTotal" />
      <a-statistic :title="t.apiAutomation.environmentTotal" :value="summary.environmentTotal" />
      <a-statistic :title="t.apiAutomation.variableSetTotal" :value="summary.variableSetTotal" />
    </div>

    <AppLoadingState v-if="loading" />
    <a-alert v-else-if="errorMessage" type="error" show-icon>
      <template #title>{{ errorMessage }}</template>
      <AppButton type="text" @click="loadReadonly">{{ t.common.retry }}</AppButton>
    </a-alert>
    <div v-else class="api-automation-shell__grid">
      <AppCard class="api-automation-shell__side api-automation-shell__card">
        <section class="api-automation-shell__panel">
          <h3 class="api-automation-shell__panel-title">{{ t.apiAutomation.modulesSection }}</h3>
          <ApiDefinitionModuleTree :modules="definitionModules" />
        </section>
      </AppCard>

      <div class="api-automation-shell__main">
        <AppCard class="api-automation-shell__card api-automation-shell__context">
          <section class="api-automation-shell__panel">
            <header class="api-automation-shell__panel-header">
              <h3 class="api-automation-shell__panel-title">{{ t.apiAutomation.runContextSection }}</h3>
            </header>
            <a-grid :cols="{ xs: 1, md: 2 }" :col-gap="12" :row-gap="12">
              <a-grid-item>
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
              </a-grid-item>
              <a-grid-item>
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
              </a-grid-item>
            </a-grid>
          </section>
        </AppCard>

        <AppCard class="api-automation-shell__card">
          <section class="api-automation-shell__panel">
            <header class="api-automation-shell__panel-header">
              <h3 class="api-automation-shell__panel-title">{{ t.apiAutomation.definitionsSection }}</h3>
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
        </AppCard>

        <AppCard class="api-automation-shell__card">
          <section class="api-automation-shell__panel">
            <ApiDefinitionDebugPanel
              :definition-id="selectedDefinitionId"
              :selected-definition-name="selectedDefinition?.name || ''"
              :environment-id="selectedEnvironmentId"
              :variable-set-id="selectedVariableSetId"
              @result="definitionRunResult = $event"
            />
            <ApiRunResultPanel v-if="definitionRunResult" :result="definitionRunResult" />
          </section>
        </AppCard>

        <AppCard class="api-automation-shell__card">
          <ApiCaseManagement
            :definition-id="selectedDefinitionId"
            :selected-definition-name="selectedDefinition?.name || ''"
            :environment-id="selectedEnvironmentId"
            :variable-set-id="selectedVariableSetId"
          />
        </AppCard>

        <AppCard class="api-automation-shell__card">
          <ApiScenarioManagement
            :definitions="definitions"
            :environment-id="selectedEnvironmentId"
            :variable-set-id="selectedVariableSetId"
          />
        </AppCard>
      </div>
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
import { AppButton, AppCard, AppLoadingState, AppSection } from '@shared/ui';
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
.api-automation-shell__grid {
  display: grid;
  grid-template-columns: minmax(210px, 280px) minmax(0, 1fr);
  gap: 10px;
  min-width: 0;
}

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

.api-automation-shell__summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  overflow: hidden;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-md);
  background: var(--app-color-surface);
}

.api-automation-shell__summary :deep(.arco-statistic) {
  min-width: 0;
  padding: 10px 14px;
  border-right: 1px solid var(--app-color-border);
}

.api-automation-shell__summary :deep(.arco-statistic:last-child) {
  border-right: 0;
}

.api-automation-shell__summary :deep(.arco-statistic-title) {
  margin-bottom: 4px;
  font-size: 12px;
}

.api-automation-shell__summary :deep(.arco-statistic-value) {
  font-size: 22px;
  line-height: 1.2;
}

.api-automation-shell__side,
.api-automation-shell__main {
  min-width: 0;
}

.api-automation-shell__main {
  display: grid;
  gap: 10px;
}

.api-automation-shell__card {
  border-radius: var(--app-radius-md);
}

.api-automation-shell__card :deep(.arco-card-body) {
  padding: 12px 14px;
}

.api-automation-shell__context :deep(.arco-select-view-single) {
  min-height: 32px;
}

.api-automation-shell__context .api-automation-shell__panel {
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
}

.api-automation-shell__context .api-automation-shell__panel-header {
  white-space: nowrap;
}

.api-automation-shell__panel {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.api-automation-shell__panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-spacing-sm);
  min-width: 0;
}

.api-automation-shell__panel-title {
  margin: 0;
  color: var(--app-color-text);
  font-size: 15px;
  font-weight: 650;
  line-height: 1.4;
}

@media (max-width: 1024px) {
  .api-automation-shell__grid {
    grid-template-columns: 1fr;
  }

  .api-automation-shell__context .api-automation-shell__panel {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .api-automation-shell__summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .api-automation-shell__summary :deep(.arco-statistic:nth-child(2)) {
    border-right: 0;
  }
}
</style>
