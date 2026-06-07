<template>
  <a-empty :description="description" />
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';

withDefaults(
  defineProps<{
    description?: string;
  }>(),
  {
    description: t.common.empty
  }
);
</script>
