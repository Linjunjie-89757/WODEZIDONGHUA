<template>
  <a-button v-bind="$attrs" :type="type" :status="status">
    <slot />
  </a-button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'primary' | 'secondary' | 'outline' | 'dashed' | 'text';
    status?: 'normal' | 'warning' | 'success' | 'danger';
  }>(),
  {
    type: 'secondary',
    status: 'normal'
  }
);
</script>
