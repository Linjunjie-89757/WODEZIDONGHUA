<template>
  <AppButton type="text" :loading="toggling" @click="handleToggle">
    {{ param.status === 1 ? t.configCenter.disable : t.configCenter.enable }}
  </AppButton>
</template>

<script setup lang="ts">
import type { ParamSetItem } from '@entities/config-center';
import { t } from '@shared/i18n';
import { AppButton } from '@shared/ui';

import { useConfigParamToggle } from '../model/useConfigParamToggle';

const props = defineProps<{
  param: ParamSetItem;
}>();

const emit = defineEmits<{
  success: [];
}>();

const { toggling, toggleParam } = useConfigParamToggle();

async function handleToggle() {
  const succeed = await toggleParam(
    props.param.id,
    props.param.status === 1 ? 0 : 1,
    props.param.workspaceCode
  );

  if (succeed) {
    emit('success');
  }
}
</script>
