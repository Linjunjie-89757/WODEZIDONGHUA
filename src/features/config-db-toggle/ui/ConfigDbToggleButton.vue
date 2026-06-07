<template>
  <AppButton type="text" :loading="toggling" @click="handleToggle">
    {{ db.status === 1 ? t.configCenter.disable : t.configCenter.enable }}
  </AppButton>
</template>

<script setup lang="ts">
import type { DbConnectionItem } from '@entities/config-center';
import { t } from '@shared/i18n';
import { AppButton } from '@shared/ui';

import { useConfigDbToggle } from '../model/useConfigDbToggle';

const props = defineProps<{
  db: DbConnectionItem;
}>();

const emit = defineEmits<{
  success: [];
}>();

const { toggling, toggleDbConnection } = useConfigDbToggle();

async function handleToggle() {
  const succeed = await toggleDbConnection(
    props.db.id,
    props.db.status === 1 ? 0 : 1,
    props.db.workspaceCode
  );

  if (succeed) {
    emit('success');
  }
}
</script>
