<template>
  <AppButton type="text" :loading="running" data-testid="api-scenario-run" @click="handleRun">
    {{ t.apiAutomation.scenarioRun }}
  </AppButton>
</template>

<script setup lang="ts">
import type { ApiRunResponse } from '@entities/api-automation';
import { t } from '@shared/i18n';
import { AppButton } from '@shared/ui';

import { useApiScenarioRun } from '../model/useApiScenarioRun';

const props = defineProps<{
  scenarioId: number | string;
  environmentId?: number | null;
  variableSetId?: number | null;
}>();

const emit = defineEmits<{
  success: [result: ApiRunResponse];
}>();

const { running, runScenario } = useApiScenarioRun();

async function handleRun() {
  const result = await runScenario(props.scenarioId, props.environmentId, props.variableSetId);

  if (result) {
    emit('success', result);
  }
}
</script>
