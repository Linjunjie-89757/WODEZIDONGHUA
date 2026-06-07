<template>
  <AppButton type="primary" @click="open">{{ t.bugManagement.create }}</AppButton>
  <AppDialog
    v-model:visible="visible"
    :title="t.bugManagement.createTitle"
    :ok-text="t.common.save"
    :cancel-text="t.common.cancel"
    :confirm-loading="saving"
    :before-ok="handleSubmit"
  >
    <a-form :model="form" layout="vertical">
      <a-form-item field="title" :label="t.bugManagement.fieldTitle" required>
        <a-input v-model="form.title" :placeholder="t.bugManagement.fieldTitlePlaceholder" />
      </a-form-item>
      <a-form-item field="description" :label="t.bugManagement.fieldDescription" required>
        <a-textarea
          v-model="form.description"
          :auto-size="{ minRows: 4, maxRows: 8 }"
          :placeholder="t.bugManagement.fieldDescriptionPlaceholder"
        />
      </a-form-item>
      <a-grid :cols="{ xs: 1, sm: 2 }" :col-gap="12">
        <a-grid-item>
          <a-form-item field="priority" :label="t.bugManagement.fieldPriority" required>
            <a-select v-model="form.priority">
              <a-option value="P0">P0</a-option>
              <a-option value="P1">P1</a-option>
              <a-option value="P2">P2</a-option>
              <a-option value="P3">P3</a-option>
            </a-select>
          </a-form-item>
        </a-grid-item>
        <a-grid-item>
          <a-form-item field="severity" :label="t.bugManagement.fieldSeverity" required>
            <a-select v-model="form.severity">
              <a-option value="CRITICAL">CRITICAL</a-option>
              <a-option value="HIGH">HIGH</a-option>
              <a-option value="MEDIUM">MEDIUM</a-option>
              <a-option value="LOW">LOW</a-option>
            </a-select>
          </a-form-item>
        </a-grid-item>
      </a-grid>
      <a-form-item field="assigneeId" :label="t.bugManagement.fieldAssignee" required>
        <a-select
          v-model="form.assigneeId"
          :loading="loadingUsers"
          :options="userOptions"
          :placeholder="t.bugManagement.fieldAssigneePlaceholder"
          allow-search
        />
      </a-form-item>
      <a-form-item field="relatedCaseId" :label="t.bugManagement.fieldRelatedCaseId">
        <a-input-number
          v-model="form.relatedCaseId"
          :placeholder="t.bugManagement.fieldRelatedCaseIdPlaceholder"
          :min="1"
          :precision="0"
        />
      </a-form-item>
      <a-form-item field="tagsText" :label="t.bugManagement.fieldTags">
        <a-input v-model="form.tagsText" :placeholder="t.bugManagement.fieldTagsPlaceholder" />
      </a-form-item>
    </a-form>
  </AppDialog>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { AppButton, AppDialog } from '@shared/ui';

import { useBugCreate } from '../model/useBugCreate';

const emit = defineEmits<{
  success: [];
}>();

const { visible, saving, loadingUsers, form, userOptions, open, submit } = useBugCreate();

async function handleSubmit() {
  const succeed = await submit();

  if (succeed) {
    emit('success');
  }

  return succeed;
}
</script>
