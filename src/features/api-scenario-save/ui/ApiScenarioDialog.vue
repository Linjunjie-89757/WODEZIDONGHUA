<template>
  <AppDialog
    v-model:visible="visible"
    :title="mode === 'create' ? t.apiAutomation.scenarioCreateTitle : t.apiAutomation.scenarioEditTitle"
    :ok-text="t.apiAutomation.save"
    :cancel-text="t.apiAutomation.cancel"
    :confirm-loading="saving || detailLoading"
    :before-ok="handleSubmit"
    width="860px"
  >
    <a-spin :loading="detailLoading">
      <a-form :model="form" layout="vertical">
        <a-grid :cols="{ xs: 1, md: 2 }" :col-gap="12">
          <a-grid-item>
            <a-form-item field="name" :label="t.apiAutomation.scenarioName" required>
              <a-input
                v-model="form.name"
                data-testid="api-scenario-name-input"
                :placeholder="t.apiAutomation.scenarioNamePlaceholder"
              />
            </a-form-item>
          </a-grid-item>
          <a-grid-item>
            <a-form-item field="status" :label="t.apiAutomation.fieldStatus">
              <a-select v-model="form.status">
                <a-option value="ACTIVE">{{ t.apiAutomation.scenarioStatusActive }}</a-option>
                <a-option value="DISABLED">{{ t.apiAutomation.scenarioStatusDisabled }}</a-option>
              </a-select>
            </a-form-item>
          </a-grid-item>
        </a-grid>

        <a-form-item field="description" :label="t.apiAutomation.fieldDescription">
          <a-textarea
            v-model="form.description"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            :placeholder="t.apiAutomation.fieldDescriptionPlaceholder"
          />
        </a-form-item>

        <ApiScenarioStepEditor
          v-model="form.steps"
          :definitions="definitions"
          :cases="cases"
        />
      </a-form>
    </a-spin>
  </AppDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import {
  apiAutomationApi,
  createDefaultScenarioForm,
  createScenarioEditForm,
  type ApiDefinitionCaseItem,
  type ApiDefinitionItem,
  type ApiScenarioFormValues
} from '@entities/api-automation';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';
import { AppDialog } from '@shared/ui';

import { useApiScenarioSave } from '../model/useApiScenarioSave';
import ApiScenarioStepEditor from './ApiScenarioStepEditor.vue';

const props = withDefaults(
  defineProps<{
    mode: 'create' | 'edit';
    scenarioId?: number | string | null;
    definitions?: ApiDefinitionItem[];
    cases?: ApiDefinitionCaseItem[];
  }>(),
  {
    scenarioId: null,
    definitions: () => [],
    cases: () => []
  }
);

const emit = defineEmits<{
  success: [];
}>();

const workspaceStore = useWorkspaceStore();
const { saving, saveScenario } = useApiScenarioSave();
const visible = ref(false);
const detailLoading = ref(false);
const form = ref<ApiScenarioFormValues>(createDefaultScenarioForm());

function openCreate() {
  form.value = createDefaultScenarioForm();
  visible.value = true;
}

async function openEdit() {
  if (!props.scenarioId) {
    return;
  }

  visible.value = true;
  detailLoading.value = true;

  try {
    const detail = await apiAutomationApi.getScenarioDetail(
      props.scenarioId,
      workspaceStore.currentWorkspace.code
    );
    form.value = createScenarioEditForm(detail);
  } catch {
    feedback.error(t.apiAutomation.scenarioDetailLoadFailed);
  } finally {
    detailLoading.value = false;
  }
}

async function handleSubmit() {
  const succeed = await saveScenario(form.value, props.mode === 'edit' ? props.scenarioId : null);

  if (succeed) {
    visible.value = false;
    emit('success');
  }

  return succeed;
}

defineExpose({
  openCreate,
  openEdit
});
</script>
