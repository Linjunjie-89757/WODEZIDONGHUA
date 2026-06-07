<template>
  <AppButton :type="buttonType" @click="open({ parentId, workspaceCode })">
    {{ buttonText || t.caseCenter.directoryCreate }}
  </AppButton>
  <AppDialog
    v-model:visible="visible"
    :title="parentId ? t.caseCenter.directoryCreateChildTitle : t.caseCenter.directoryCreateTitle"
    :ok-text="t.common.save"
    :cancel-text="t.common.cancel"
    :confirm-loading="saving"
    :before-ok="handleSubmit"
  >
    <a-form :model="form" layout="vertical">
      <a-form-item field="name" :label="t.caseCenter.directoryName" required>
        <a-input v-model="form.name" :placeholder="t.caseCenter.directoryNamePlaceholder" />
      </a-form-item>
    </a-form>
  </AppDialog>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { AppButton, AppDialog } from '@shared/ui';

import { useCaseDirectoryCreate } from '../model/useCaseDirectoryCreate';

withDefaults(
  defineProps<{
    parentId?: number | null;
    workspaceCode?: string;
    buttonText?: string;
    buttonType?: 'primary' | 'secondary' | 'outline' | 'dashed' | 'text';
  }>(),
  {
    parentId: null,
    workspaceCode: '',
    buttonText: '',
    buttonType: 'text'
  }
);

const emit = defineEmits<{
  success: [];
}>();

const { visible, saving, form, open, submit } = useCaseDirectoryCreate();

async function handleSubmit() {
  const succeed = await submit();

  if (succeed) {
    emit('success');
  }

  return succeed;
}
</script>
