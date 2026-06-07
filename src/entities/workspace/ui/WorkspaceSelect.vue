<template>
  <a-select
    :loading="loading"
    :model-value="modelValue"
    :options="options"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import type { OptionItem } from '@shared/types/common';

withDefaults(
  defineProps<{
    loading?: boolean;
    modelValue?: string;
    options: OptionItem[];
  }>(),
  {
    loading: false
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>
