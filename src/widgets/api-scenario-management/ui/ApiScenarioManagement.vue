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
        <section class="api-scenario-management__panel">
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
        <section class="api-scenario-management__panel">
          <h4>{{ t.apiAutomation.scenarioList }}</h4>
          <AppLoadingState v-if="loading" />
          <div v-else-if="!scenarios.length" class="api-scenario-management__empty">
            {{ t.apiAutomation.scenarioEmpty }}
          </div>
          <div v-else class="api-scenario-management__list" data-testid="api-scenario-list">
            <article
              v-for="scenario in scenarios"
              :key="scenario.id"
              class="api-scenario-management__row"
              data-testid="api-scenario-row"
            >
              <button type="button" class="api-scenario-management__row-main" @click="selectScenario(scenario.id)">
                <strong>{{ scenario.name }}</strong>
                <small>{{ scenario.status || '-' }} {{ t.apiAutomation.resultSeparator }} {{ scenario.lastRunResult || '-' }}</small>
              </button>
              <div class="api-scenario-management__row-actions">
                <ApiScenarioRunButton
                  :scenario-id="scenario.id"
                  :environment-id="environmentId"
                  :variable-set-id="variableSetId"
                  @success="setRunResult"
                />
                <AppButton type="text" data-testid="api-scenario-edit" @click="openEditDialog(scenario.id)">
                  {{ t.common.edit }}
                </AppButton>
                <ApiScenarioDeleteButton :scenario-id="scenario.id" @success="loadScenarios" />
              </div>
            </article>
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
          <a-descriptions :column="1" bordered>
            <a-descriptions-item :label="t.apiAutomation.fieldDescription">
              {{ selectedScenarioDetail?.description || '-' }}
            </a-descriptions-item>
            <a-descriptions-item :label="t.apiAutomation.fieldStatus">
              {{ selectedScenarioDetail?.status || '-' }}
            </a-descriptions-item>
          </a-descriptions>

          <section>
            <h4>{{ t.apiAutomation.scenarioSteps }}</h4>
            <div v-if="!selectedScenarioDetail?.steps?.length" class="api-scenario-management__empty">
              {{ t.apiAutomation.scenarioStepEmpty }}
            </div>
            <div v-else class="api-scenario-management__steps" data-testid="api-scenario-step-tree">
              <ScenarioStepNode
                v-for="(step, index) in selectedScenarioDetail.steps"
                :key="step.id || index"
                :step="step"
              />
            </div>
          </section>

          <section v-if="runResult" data-testid="api-scenario-run-result">
            <h4>{{ t.apiAutomation.scenarioRunResult }}</h4>
            <ApiRunResultPanel :result="runResult" />
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

import type { ApiDefinitionItem, ApiScenarioStep } from '@entities/api-automation';
import { ApiScenarioDeleteButton } from '@features/api-scenario-delete';
import { ApiScenarioRunButton } from '@features/api-scenario-run';
import { ApiScenarioDialog } from '@features/api-scenario-save';
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

const detailVisible = ref(false);
const dialogMode = ref<'create' | 'edit'>('create');
const editingScenarioId = ref<number | null>(null);
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

async function openEditDialog(id: number) {
  dialogMode.value = 'edit';
  editingScenarioId.value = id;
  await nextTick();
  await scenarioDialogRef.value?.openEdit();
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
        GROUP: t.apiAutomation.scenarioStepGroup
      };
      return labels[type] || type;
    }

    return () =>
      h('article', { class: 'api-scenario-management__step' }, [
        h('strong', stepProps.step.name || typeLabel(stepProps.step.stepType)),
        h('small', typeLabel(stepProps.step.stepType)),
        stepProps.step.children?.length
          ? h(
              'div',
              { class: 'api-scenario-management__step-children' },
              stepProps.step.children.map((child) => h(ScenarioStepNode, { step: child }))
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
  gap: var(--app-spacing-md);
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
.api-scenario-management__row-main small,
.api-scenario-management__modules small,
.api-scenario-management__step small {
  color: var(--app-color-text-muted);
}

.api-scenario-management__panel,
.api-scenario-management__row,
.api-scenario-management__modules article,
.api-scenario-management__step {
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: var(--app-color-surface);
  padding: var(--app-spacing-sm);
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

.api-scenario-management__step {
  display: grid;
  gap: 4px;
}

.api-scenario-management__step-children {
  display: grid;
  gap: var(--app-spacing-sm);
  margin-left: var(--app-spacing-md);
}

@media (max-width: 720px) {
  .api-scenario-management__header,
  .api-scenario-management__row {
    display: grid;
  }
}
</style>
