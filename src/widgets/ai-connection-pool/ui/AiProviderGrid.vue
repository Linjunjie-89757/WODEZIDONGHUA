<template>
  <section class="ai-provider-grid">
    <header>{{ t.aiConnection.supportedProviders }}</header>
    <div class="ai-provider-grid__items">
      <article
        v-for="provider in aiProviderOptions"
        :key="provider.value"
        :class="{ 'has-connection': countByProvider(provider.value) > 0 }"
      >
        <span class="ai-provider-grid__logo" :style="{ '--provider-color': provider.color }">
          {{ provider.label.slice(0, 1) }}
        </span>
        <strong>{{ provider.label }}</strong>
        <small>{{ countByProvider(provider.value) }} {{ t.aiConnection.providerConnectionCountSuffix }}</small>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { aiProviderOptions, type AiConnection, type AiProvider } from '@entities/ai-model';
import { t } from '@shared/i18n';

const props = defineProps<{
  connections: AiConnection[];
}>();

function countByProvider(provider: AiProvider) {
  return props.connections.filter((item) => item.provider === provider).length;
}
</script>

<style scoped>
.ai-provider-grid {
  margin-top: 24px;
}

.ai-provider-grid header {
  margin-bottom: 12px;
  color: #374151;
  font-size: 14px;
  font-weight: 650;
}

.ai-provider-grid__items {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.ai-provider-grid article {
  display: flex;
  align-items: center;
  flex-direction: column;
  min-width: 0;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #f9fafb;
  gap: 7px;
  padding: 13px 10px;
  text-align: center;
}

.ai-provider-grid article.has-connection {
  border-color: #bfdbfe;
  background: #eff6ff;
}

.ai-provider-grid__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--provider-color);
  color: #ffffff;
  font-size: 16px;
  font-weight: 800;
  opacity: 0.42;
}

.ai-provider-grid article.has-connection .ai-provider-grid__logo {
  opacity: 1;
}

.ai-provider-grid strong {
  max-width: 100%;
  overflow: hidden;
  color: #374151;
  font-size: 12px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ai-provider-grid small {
  color: #9ca3af;
  font-size: 12px;
}

@media (max-width: 1100px) {
  .ai-provider-grid__items {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .ai-provider-grid__items {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
