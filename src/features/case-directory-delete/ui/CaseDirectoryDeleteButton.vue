<template>
  <AppButton type="text" status="danger" :loading="deleting" @click="handleDelete">
    {{ t.common.delete }}
  </AppButton>
</template>

<script setup lang="ts">
import type { CaseDirectoryNode } from '@entities/case-center';
import { t } from '@shared/i18n';
import { appConfirm, AppButton } from '@shared/ui';

import { useCaseDirectoryDelete } from '../model/useCaseDirectoryDelete';

const props = defineProps<{
  node: CaseDirectoryNode;
}>();

const emit = defineEmits<{
  success: [];
}>();

const { deleting, deleteDirectory } = useCaseDirectoryDelete();

function handleDelete() {
  appConfirm(t.caseCenter.directoryDeleteConfirm, t.common.confirmAction, confirmDelete);
}

async function confirmDelete() {
  const succeed = await deleteDirectory(props.node.id, props.node.workspaceCode);

  if (succeed) {
    emit('success');
  }
}
</script>
