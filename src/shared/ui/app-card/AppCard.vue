<template>
  <a-card :bordered="bordered" class="app-card">
    <slot />
  </a-card>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    bordered?: boolean;
  }>(),
  {
    bordered: true
  }
);
</script>

<style scoped>
.app-card {
  border-radius: var(--app-radius-lg);
}
</style>
