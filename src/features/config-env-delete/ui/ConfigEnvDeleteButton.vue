<template>
  <AppButton type="text" status="danger" :loading="deleting" @click="handleDelete">
    {{ t.common.delete }}
  </AppButton>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { appConfirm, AppButton } from '@shared/ui';

import { useConfigEnvDelete } from '../model/useConfigEnvDelete';

const props = defineProps<{
  envId: number | string;
  workspaceCode?: string;
}>();

const emit = defineEmits<{
  success: [];
}>();

const { deleting, deleteEnv } = useConfigEnvDelete();

function handleDelete() {
  appConfirm(t.configCenter.envDeleteConfirm, t.common.confirmAction, confirmDelete);
}

async function confirmDelete() {
  const succeed = await deleteEnv(props.envId, props.workspaceCode);

  if (succeed) {
    emit('success');
  }
}
</script>
