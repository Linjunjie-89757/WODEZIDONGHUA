<template>
  <div class="ai-provider-grid">
    <AppCard v-for="provider in aiProviderOptions" :key="provider.value">
      <div class="ai-provider-grid__item">
        <AppProviderBadge :color="provider.color" :label="provider.label" />
        <span>{{ countByProvider(provider.value) }} {{ t.aiConnection.providerConnectionCountSuffix }}</span>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { aiProviderOptions, type AiConnection, type AiProvider } from '@entities/ai-model';
import { t } from '@shared/i18n';
import { AppCard, AppProviderBadge } from '@shared/ui';

const props = defineProps<{
  connections: AiConnection[];
}>();

function countByProvider(provider: AiProvider) {
  return props.connections.filter((item) => item.provider === provider).length;
}
</script>

<style scoped>
.ai-provider-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--app-spacing-md);
}

.ai-provider-grid__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-spacing-md);
}
</style>
