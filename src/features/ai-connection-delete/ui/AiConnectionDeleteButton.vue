<template>
  <AppButton type="text" status="danger" :loading="deleting" @click="handleDelete">
    {{ t.common.delete }}
  </AppButton>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { appConfirm, AppButton } from '@shared/ui';

import { useAiConnectionDelete } from '../model/useAiConnectionDelete';

const props = defineProps<{
  connectionId: number | string;
}>();

const emit = defineEmits<{
  success: [];
}>();

const { deleting, deleteConnection } = useAiConnectionDelete();

function handleDelete() {
  appConfirm(t.aiConnection.deleteConfirm, t.common.confirmAction, confirmDelete);
}

async function confirmDelete() {
  const succeed = await deleteConnection(props.connectionId);

  if (succeed) {
    emit('success');
  }
}
</script>
