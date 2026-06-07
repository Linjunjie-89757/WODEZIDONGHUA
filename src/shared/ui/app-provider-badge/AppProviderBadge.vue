<template>
  <a-tag :color="color" size="small">{{ label }}</a-tag>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    color?: string;
  }>(),
  {
    color: 'arcoblue'
  }
);
</script>
