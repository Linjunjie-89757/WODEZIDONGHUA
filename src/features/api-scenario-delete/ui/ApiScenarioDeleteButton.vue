<template>
  <AppButton type="text" :loading="deleting" data-testid="api-scenario-delete" @click="handleDelete">
    {{ t.common.delete }}
  </AppButton>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';
import { AppButton } from '@shared/ui';

import { useApiScenarioDelete } from '../model/useApiScenarioDelete';

const props = defineProps<{
  scenarioId: number | string;
}>();

const emit = defineEmits<{
  success: [];
}>();

const { deleting, deleteScenario } = useApiScenarioDelete();

function handleDelete() {
  feedback.confirm(t.apiAutomation.scenarioDeleteConfirm, undefined, async () => {
    const succeed = await deleteScenario(props.scenarioId);

    if (succeed) {
      emit('success');
    }
  });
}
</script>
