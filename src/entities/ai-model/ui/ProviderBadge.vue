<template>
  <AppProviderBadge :color="meta.color" :label="meta.label" />
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { AppProviderBadge } from '@shared/ui';

import { aiProviderMeta } from '../lib/providerMeta';
import type { AiProvider } from '../model/types';

const props = defineProps<{
  provider: AiProvider;
}>();

const meta = computed(() => aiProviderMeta[props.provider] ?? aiProviderMeta.custom);
</script>
