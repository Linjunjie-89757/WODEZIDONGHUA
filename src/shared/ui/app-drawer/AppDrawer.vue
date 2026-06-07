<template>
  <a-drawer v-bind="$attrs" :width="width">
    <slot />
  </a-drawer>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: number | string;
  }>(),
  {
    width: 560
  }
);
</script>
