<template>
  <AppButton type="text" :loading="deleting" data-testid="api-case-delete" @click="handleDelete">
    {{ t.common.delete }}
  </AppButton>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';
import { AppButton } from '@shared/ui';

import { useApiCaseDelete } from '../model/useApiCaseDelete';

const props = defineProps<{
  caseId: number | string;
}>();

const emit = defineEmits<{
  success: [];
}>();

const { deleting, deleteCase } = useApiCaseDelete();

function handleDelete() {
  feedback.confirm(t.apiAutomation.caseDeleteConfirm, undefined, async () => {
    const succeed = await deleteCase(props.caseId);

    if (succeed) {
      emit('success');
    }
  });
}
</script>
