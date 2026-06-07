<template>
  <AppButton type="text" status="danger" :loading="deleting" data-testid="api-definition-delete" @click="handleDelete">
    {{ t.apiAutomation.delete }}
  </AppButton>
  <AppDialog
    v-model:visible="confirmVisible"
    :title="t.common.confirmAction"
    :ok-text="t.common.confirm"
    :cancel-text="t.common.cancel"
    :confirm-loading="deleting"
    :before-ok="confirmDelete"
    width="420px"
  >
    <p class="api-definition-delete__content">{{ t.apiAutomation.deleteConfirm }}</p>
  </AppDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { t } from '@shared/i18n';
import { AppButton, AppDialog } from '@shared/ui';

import { useApiDefinitionDelete } from '../model/useApiDefinitionDelete';

const props = defineProps<{
  definitionId: number | string;
  workspaceCode?: string;
}>();

const emit = defineEmits<{
  success: [];
}>();

const confirmVisible = ref(false);
const { deleting, deleteDefinition } = useApiDefinitionDelete();

function handleDelete() {
  confirmVisible.value = true;
}

async function confirmDelete() {
  const succeed = await deleteDefinition(props.definitionId, props.workspaceCode);

  if (succeed) {
    confirmVisible.value = false;
    emit('success');
  }

  return succeed;
}
</script>

<style scoped>
.api-definition-delete__content {
  margin: 0;
}
</style>
