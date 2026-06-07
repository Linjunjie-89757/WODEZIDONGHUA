<template>
  <AppButton type="text" :loading="toggling" @click="handleToggle">
    {{ env.status === 1 ? t.configCenter.disable : t.configCenter.enable }}
  </AppButton>
</template>

<script setup lang="ts">
import type { EnvConfigItem } from '@entities/config-center';
import { t } from '@shared/i18n';
import { AppButton } from '@shared/ui';

import { useConfigEnvToggle } from '../model/useConfigEnvToggle';

const props = defineProps<{
  env: EnvConfigItem;
}>();

const emit = defineEmits<{
  success: [];
}>();

const { toggling, toggleEnv } = useConfigEnvToggle();

async function handleToggle() {
  const succeed = await toggleEnv(
    props.env.id,
    props.env.status === 1 ? 0 : 1,
    props.env.workspaceCode
  );

  if (succeed) {
    emit('success');
  }
}
</script>
