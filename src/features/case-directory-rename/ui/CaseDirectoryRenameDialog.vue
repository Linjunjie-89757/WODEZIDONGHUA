<template>
  <AppButton type="text" @click="open(node)">{{ t.caseCenter.directoryRename }}</AppButton>
  <AppDialog
    v-model:visible="visible"
    :title="`${t.caseCenter.directoryRenameTitle} ${current?.name || ''}`"
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
import type { CaseDirectoryNode } from '@entities/case-center';
import { t } from '@shared/i18n';
import { AppButton, AppDialog } from '@shared/ui';

import { useCaseDirectoryRename } from '../model/useCaseDirectoryRename';

defineProps<{
  node: CaseDirectoryNode;
}>();

const emit = defineEmits<{
  success: [];
}>();

const { visible, saving, current, form, open, submit } = useCaseDirectoryRename();

async function handleSubmit() {
  const succeed = await submit();

  if (succeed) {
    emit('success');
  }

  return succeed;
}
</script>
