<template>
  <AppSection
    :title="t.apiAutomation.overviewTitle"
    :description="t.apiAutomation.overviewDescription"
    data-testid="api-automation-shell"
  >
    <template #actions>
      <AppButton type="text" :loading="loading" @click="loadReadonly">
        {{ t.apiAutomation.retry }}
      </AppButton>
    </template>

    <a-grid :cols="{ xs: 1, sm: 4 }" :col-gap="12" :row-gap="12">
      <a-grid-item>
        <a-statistic :title="t.apiAutomation.definitionTotal" :value="summary.definitionTotal" />
      </a-grid-item>
      <a-grid-item>
        <a-statistic :title="t.apiAutomation.moduleTotal" :value="summary.moduleTotal" />
      </a-grid-item>
      <a-grid-item>
        <a-statistic :title="t.apiAutomation.environmentTotal" :value="summary.environmentTotal" />
      </a-grid-item>
      <a-grid-item>
        <a-statistic :title="t.apiAutomation.variableSetTotal" :value="summary.variableSetTotal" />
      </a-grid-item>
    </a-grid>

    <AppLoadingState v-if="loading" />
    <a-alert v-else-if="errorMessage" type="error" show-icon>
      <template #title>{{ errorMessage }}</template>
      <AppButton type="text" @click="loadReadonly">{{ t.common.retry }}</AppButton>
    </a-alert>
    <div v-else class="api-automation-shell__grid">
      <AppCard class="api-automation-shell__side">
        <section class="api-automation-shell__panel">
          <h3 class="api-automation-shell__panel-title">{{ t.apiAutomation.modulesSection }}</h3>
          <ApiDefinitionModuleTree :modules="definitionModules" />
        </section>
      </AppCard>

      <div class="api-automation-shell__main">
        <AppCard>
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

        <AppCard>
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

        <AppCard>
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

        <AppCard>
          <ApiCaseManagement
            :definition-id="selectedDefinitionId"
            :selected-definition-name="selectedDefinition?.name || ''"
            :environment-id="selectedEnvironmentId"
            :variable-set-id="selectedVariableSetId"
          />
        </AppCard>

        <AppCard>
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
  grid-template-columns: minmax(240px, 320px) minmax(0, 1fr);
  gap: var(--app-spacing-md);
  min-width: 0;
}

.api-automation-shell__side,
.api-automation-shell__main {
  min-width: 0;
}

.api-automation-shell__main {
  display: grid;
  gap: var(--app-spacing-md);
}

.api-automation-shell__panel {
  display: grid;
  gap: var(--app-spacing-md);
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
}
</style>
