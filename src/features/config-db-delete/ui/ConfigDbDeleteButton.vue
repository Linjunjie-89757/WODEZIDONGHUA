<template>
  <AppButton type="text" status="danger" :loading="deleting" @click="handleDelete">
    {{ t.common.delete }}
  </AppButton>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { appConfirm, AppButton } from '@shared/ui';

import { useConfigDbDelete } from '../model/useConfigDbDelete';

const props = defineProps<{
  dbId: number | string;
  workspaceCode?: string;
}>();

const emit = defineEmits<{
  success: [];
}>();

const { deleting, deleteDbConnection } = useConfigDbDelete();

function handleDelete() {
  appConfirm(t.configCenter.dbDeleteConfirm, t.common.confirmAction, confirmDelete);
}

async function confirmDelete() {
  const succeed = await deleteDbConnection(props.dbId, props.workspaceCode);

  if (succeed) {
    emit('success');
  }
}
</script>
