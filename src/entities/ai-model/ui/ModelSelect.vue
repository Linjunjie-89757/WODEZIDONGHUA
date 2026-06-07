<template>
  <a-select
    :model-value="modelValue"
    allow-create
    allow-search
    :placeholder="t.aiConnection.modelSelectPlaceholder"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <a-option value="gpt-4o-mini">gpt-4o-mini</a-option>
    <a-option value="gpt-4.1-mini">gpt-4.1-mini</a-option>
    <a-option value="qwen-plus">qwen-plus</a-option>
  </a-select>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';

defineProps<{
  modelValue?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>
