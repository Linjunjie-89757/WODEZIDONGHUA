<template>
  <AppButton type="text" status="danger" :loading="deleting" @click="handleDelete">
    {{ t.common.delete }}
  </AppButton>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { appConfirm, AppButton } from '@shared/ui';

import { useCaseDelete } from '../model/useCaseDelete';

const props = defineProps<{
  caseId: number | string;
  workspaceCode?: string;
}>();

const emit = defineEmits<{
  success: [];
}>();

const { deleting, deleteCase } = useCaseDelete();

function handleDelete() {
  appConfirm(t.caseCenter.deleteConfirm, t.common.confirmAction, confirmDelete);
}

async function confirmDelete() {
  const succeed = await deleteCase(props.caseId, props.workspaceCode);

  if (succeed) {
    emit('success');
  }
}
</script>
