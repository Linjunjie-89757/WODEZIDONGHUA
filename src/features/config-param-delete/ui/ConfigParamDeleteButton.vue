<template>
  <AppButton type="text" status="danger" :loading="deleting" @click="handleDelete">
    {{ t.common.delete }}
  </AppButton>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { appConfirm, AppButton } from '@shared/ui';

import { useConfigParamDelete } from '../model/useConfigParamDelete';

const props = defineProps<{
  paramId: number | string;
  workspaceCode?: string;
}>();

const emit = defineEmits<{
  success: [];
}>();

const { deleting, deleteParam } = useConfigParamDelete();

function handleDelete() {
  appConfirm(t.configCenter.paramDeleteConfirm, t.common.confirmAction, confirmDelete);
}

async function confirmDelete() {
  const succeed = await deleteParam(props.paramId, props.workspaceCode);

  if (succeed) {
    emit('success');
  }
}
</script>
