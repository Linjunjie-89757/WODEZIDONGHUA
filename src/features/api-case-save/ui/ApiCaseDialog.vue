<template>
  <AppDialog
    v-model:visible="visible"
    :title="mode === 'create' ? t.apiAutomation.caseCreateTitle : t.apiAutomation.caseEditTitle"
    :ok-text="t.apiAutomation.save"
    :cancel-text="t.apiAutomation.cancel"
    :confirm-loading="saving || detailLoading"
    :before-ok="handleSubmit"
    width="720px"
    class="api-case-dialog"
  >
    <a-spin :loading="detailLoading">
      <a-form :model="form" layout="vertical">
        <a-grid :cols="{ xs: 1, md: 2 }" :col-gap="12">
          <a-grid-item>
            <a-form-item field="name" :label="t.apiAutomation.caseName" required>
              <a-input
                v-model="form.name"
                data-testid="api-case-name-input"
                :placeholder="t.apiAutomation.caseNamePlaceholder"
              />
            </a-form-item>
          </a-grid-item>
          <a-grid-item>
            <a-form-item field="priority" :label="t.apiAutomation.casePriority">
              <a-select v-model="form.priority" data-testid="api-case-priority-select">
                <a-option value="P0">P0</a-option>
                <a-option value="P1">P1</a-option>
                <a-option value="P2">P2</a-option>
                <a-option value="P3">P3</a-option>
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

        <a-grid :cols="{ xs: 1, md: 3 }" :col-gap="12">
          <a-grid-item>
            <a-form-item field="method" :label="t.apiAutomation.fieldMethod" required>
              <a-select v-model="form.method" data-testid="api-case-method-select">
                <a-option v-for="method in requestMethods" :key="method" :value="method">
                  {{ method }}
                </a-option>
              </a-select>
            </a-form-item>
          </a-grid-item>
          <a-grid-item :span="2">
            <a-form-item field="path" :label="t.apiAutomation.fieldPath" required>
              <a-input
                v-model="form.path"
                data-testid="api-case-path-input"
                :placeholder="t.apiAutomation.fieldPathPlaceholder"
              />
            </a-form-item>
          </a-grid-item>
        </a-grid>

        <a-grid :cols="{ xs: 1, md: 3 }" :col-gap="12">
          <a-grid-item>
            <a-form-item field="timeoutMs" :label="t.apiAutomation.fieldTimeout">
              <a-input-number v-model="form.timeoutMs" :min="1000" :step="1000" />
            </a-form-item>
          </a-grid-item>
          <a-grid-item>
            <a-form-item field="queryKey" :label="t.apiAutomation.fieldQueryKey">
              <a-input v-model="form.queryKey" />
            </a-form-item>
          </a-grid-item>
          <a-grid-item>
            <a-form-item field="queryValue" :label="t.apiAutomation.fieldQueryValue">
              <a-input v-model="form.queryValue" />
            </a-form-item>
          </a-grid-item>
        </a-grid>

        <a-grid :cols="{ xs: 1, md: 2 }" :col-gap="12">
          <a-grid-item>
            <a-form-item field="headerKey" :label="t.apiAutomation.fieldHeaderKey">
              <a-input v-model="form.headerKey" />
            </a-form-item>
          </a-grid-item>
          <a-grid-item>
            <a-form-item field="headerValue" :label="t.apiAutomation.fieldHeaderValue">
              <a-input v-model="form.headerValue" />
            </a-form-item>
          </a-grid-item>
        </a-grid>

        <a-form-item field="rawBody" :label="t.apiAutomation.fieldRawBody">
          <a-textarea
            v-model="form.rawBody"
            :auto-size="{ minRows: 3, maxRows: 6 }"
            :placeholder="t.apiAutomation.fieldRawBodyPlaceholder"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </AppDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import {
  apiAutomationApi,
  createCaseEditForm,
  createDefaultCaseForm,
  type ApiDefinitionCaseFormValues
} from '@entities/api-automation';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';
import { AppDialog } from '@shared/ui';

import { useApiCaseSave } from '../model/useApiCaseSave';

const props = withDefaults(
  defineProps<{
    mode: 'create' | 'edit';
    caseId?: number | string | null;
    definitionId?: number | null;
  }>(),
  {
    caseId: null,
    definitionId: null
  }
);

const emit = defineEmits<{
  success: [];
}>();

const requestMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;
const workspaceStore = useWorkspaceStore();
const { saving, saveCase } = useApiCaseSave();
const visible = ref(false);
const detailLoading = ref(false);
const form = ref<ApiDefinitionCaseFormValues>(createDefaultCaseForm(props.definitionId));

function openCreate() {
  form.value = createDefaultCaseForm(props.definitionId);
  visible.value = true;
}

async function openEdit() {
  if (!props.caseId) {
    return;
  }

  visible.value = true;
  detailLoading.value = true;

  try {
    const detail = await apiAutomationApi.getCaseDetail(
      props.caseId,
      workspaceStore.currentWorkspace.code
    );
    form.value = createCaseEditForm(detail);
  } catch {
    feedback.error(t.apiAutomation.caseDetailLoadFailed);
  } finally {
    detailLoading.value = false;
  }
}

async function handleSubmit() {
  const succeed = await saveCase(form.value, props.mode === 'edit' ? props.caseId : null);

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

<style scoped>
.api-case-dialog :deep(.arco-modal-body) {
  max-height: 72vh;
  overflow: auto;
  padding-top: 14px;
}

.api-case-dialog :deep(.arco-form-item) {
  margin-bottom: 12px;
}
</style>
