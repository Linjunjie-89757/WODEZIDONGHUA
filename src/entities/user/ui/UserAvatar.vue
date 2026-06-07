<template>
  <a-avatar :size="size">{{ firstLetter }}</a-avatar>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    name?: string;
    size?: number;
  }>(),
  {
    name: 'U',
    size: 32
  }
);

const firstLetter = computed(() => props.name.slice(0, 1).toUpperCase());
</script>
