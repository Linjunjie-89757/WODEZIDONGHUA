<template>
  <a-modal v-bind="$attrs" :width="width" :on-before-ok="beforeOk">
    <slot />
  </a-modal>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: number | string;
    beforeOk?: (done: (closed: boolean) => void) => void | boolean | Promise<void | boolean>;
  }>(),
  {
    width: 640
  }
);
</script>
