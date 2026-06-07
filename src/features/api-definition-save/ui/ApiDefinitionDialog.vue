<template>
  <AppDialog
    v-model:visible="visible"
    :title="mode === 'create' ? t.apiAutomation.createTitle : t.apiAutomation.editTitle"
    :ok-text="t.apiAutomation.save"
    :cancel-text="t.apiAutomation.cancel"
    :confirm-loading="saving || detailLoading"
    :before-ok="handleSubmit"
    width="760px"
    class="api-definition-dialog"
  >
    <a-spin :loading="detailLoading">
      <a-form :model="form" layout="vertical">
        <a-grid :cols="{ xs: 1, md: 2 }" :col-gap="12">
          <a-grid-item>
            <a-form-item field="name" :label="t.apiAutomation.fieldName" required>
              <a-input
                v-model="form.name"
                data-testid="api-definition-name-input"
                :placeholder="t.apiAutomation.fieldNamePlaceholder"
              />
            </a-form-item>
          </a-grid-item>
          <a-grid-item>
            <a-form-item field="directoryName" :label="t.apiAutomation.fieldDirectory">
              <a-input
                v-model="form.directoryName"
                :placeholder="t.apiAutomation.fieldDirectoryPlaceholder"
              />
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
              <a-select v-model="form.method" data-testid="api-definition-method-select">
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
                data-testid="api-definition-path-input"
                :placeholder="t.apiAutomation.fieldPathPlaceholder"
              />
            </a-form-item>
          </a-grid-item>
        </a-grid>

        <a-grid :cols="{ xs: 1, md: 3 }" :col-gap="12">
          <a-grid-item>
            <a-form-item field="timeoutMs" :label="t.apiAutomation.fieldTimeout">
              <a-input-number
                v-model="form.timeoutMs"
                data-testid="api-definition-timeout-input"
                :min="1000"
                :step="1000"
              />
            </a-form-item>
          </a-grid-item>
          <a-grid-item>
            <a-form-item field="queryKey" :label="t.apiAutomation.fieldQueryKey">
              <a-input v-model="form.queryKey" data-testid="api-definition-query-key-input" />
            </a-form-item>
          </a-grid-item>
          <a-grid-item>
            <a-form-item field="queryValue" :label="t.apiAutomation.fieldQueryValue">
              <a-input v-model="form.queryValue" data-testid="api-definition-query-value-input" />
            </a-form-item>
          </a-grid-item>
        </a-grid>

        <a-grid :cols="{ xs: 1, md: 2 }" :col-gap="12">
          <a-grid-item>
            <a-form-item field="headerKey" :label="t.apiAutomation.fieldHeaderKey">
              <a-input v-model="form.headerKey" data-testid="api-definition-header-key-input" />
            </a-form-item>
          </a-grid-item>
          <a-grid-item>
            <a-form-item field="headerValue" :label="t.apiAutomation.fieldHeaderValue">
              <a-input v-model="form.headerValue" data-testid="api-definition-header-value-input" />
            </a-form-item>
          </a-grid-item>
        </a-grid>

        <a-form-item field="rawBody" :label="t.apiAutomation.fieldRawBody">
          <a-textarea
            v-model="form.rawBody"
            data-testid="api-definition-body-input"
            :auto-size="{ minRows: 4, maxRows: 8 }"
            :placeholder="t.apiAutomation.fieldRawBodyPlaceholder"
          />
        </a-form-item>

        <ApiDefinitionAssertionEditor v-model="form.assertions" />
        <ApiDefinitionProcessorEditor
          v-model:pre-processors="form.preProcessors"
          v-model:post-processors="form.postProcessors"
        />
      </a-form>
    </a-spin>
  </AppDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import {
  apiAutomationApi,
  createDefaultDefinitionForm,
  createDefinitionEditForm,
  type ApiDefinitionFormValues
} from '@entities/api-automation';
import { ApiDefinitionAssertionEditor } from '@features/api-definition-assertions';
import { ApiDefinitionProcessorEditor } from '@features/api-definition-processors';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';
import { AppDialog } from '@shared/ui';

import { useApiDefinitionSave } from '../model/useApiDefinitionSave';

const props = withDefaults(
  defineProps<{
    mode: 'create' | 'edit';
    definitionId?: number | string | null;
  }>(),
  {
    definitionId: null
  }
);

const emit = defineEmits<{
  success: [];
}>();

const requestMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;
const workspaceStore = useWorkspaceStore();
const { saving, saveDefinition } = useApiDefinitionSave();
const visible = ref(false);
const detailLoading = ref(false);
const form = ref<ApiDefinitionFormValues>(createDefaultDefinitionForm());

function openCreate() {
  form.value = createDefaultDefinitionForm();
  visible.value = true;
}

async function openEdit() {
  if (!props.definitionId) {
    return;
  }

  visible.value = true;
  detailLoading.value = true;

  try {
    const detail = await apiAutomationApi.getDefinitionDetail(
      props.definitionId,
      workspaceStore.currentWorkspace.code
    );
    form.value = createDefinitionEditForm(detail);
  } catch {
    feedback.error(t.apiAutomation.detailLoadFailed);
  } finally {
    detailLoading.value = false;
  }
}

async function handleSubmit() {
  const succeed = await saveDefinition(
    form.value,
    props.mode === 'edit' ? props.definitionId : null
  );

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
.api-definition-dialog :deep(.arco-modal-body) {
  max-height: 72vh;
  overflow: auto;
  padding-top: 14px;
}

.api-definition-dialog :deep(.arco-form-item) {
  margin-bottom: 12px;
}
</style>
