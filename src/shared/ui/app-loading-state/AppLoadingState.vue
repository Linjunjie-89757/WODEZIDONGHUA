<template>
  <div class="app-loading-state">
    <a-spin :tip="tip" />
  </div>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';

withDefaults(
  defineProps<{
    tip?: string;
  }>(),
  {
    tip: t.common.loading
  }
);
</script>

<style scoped>
.app-loading-state {
  display: grid;
  min-height: 160px;
  place-items: center;
}
</style>
