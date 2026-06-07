<template>
  <AppButton type="text" :loading="running" data-testid="api-case-run" @click="handleRun">
    {{ t.apiAutomation.caseRun }}
  </AppButton>
</template>

<script setup lang="ts">
import type { ApiRunResponse } from '@entities/api-automation';
import { t } from '@shared/i18n';
import { AppButton } from '@shared/ui';

import { useApiCaseRun } from '../model/useApiCaseRun';

const props = defineProps<{
  caseId: number | string;
  environmentId?: number | null;
  variableSetId?: number | null;
}>();

const emit = defineEmits<{
  success: [result: ApiRunResponse];
}>();

const { running, runCase } = useApiCaseRun();

async function handleRun() {
  const result = await runCase(props.caseId, props.environmentId, props.variableSetId);

  if (result) {
    emit('success', result);
  }
}
</script>
