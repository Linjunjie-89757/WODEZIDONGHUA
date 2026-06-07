<template>
  <section class="ai-connection-pool">
    <header class="ai-connection-pool__head">
      <div>
        <h2>{{ t.aiConnection.title }}</h2>
        <p>{{ t.aiConnection.description }}</p>
      </div>
      <AiConnectionCreateDialog @success="loadConnections" />
    </header>

    <section class="ai-connection-pool__stats">
      <article>
        <span>{{ t.aiConnection.statsTotal }}</span>
        <strong>{{ stats.total }}</strong>
      </article>
      <article class="is-green">
        <span>{{ t.aiConnection.statsReady }}</span>
        <strong>{{ stats.ready }}</strong>
      </article>
      <article class="is-red">
        <span>{{ t.aiConnection.statsDisabled }}</span>
        <strong>{{ stats.disabled }}</strong>
      </article>
      <article class="is-purple">
        <span>{{ t.aiConnection.statsProviders }}</span>
        <strong>{{ providerCount }}</strong>
      </article>
    </section>

    <AiProviderGrid :connections="connections" />

    <section class="ai-connection-pool__list">
      <AppLoadingState v-if="loading" />
      <a-alert v-else-if="errorMessage" type="error" show-icon>
        <template #title>{{ errorMessage }}</template>
        <AppButton type="text" @click="loadConnections">{{ t.common.retry }}</AppButton>
      </a-alert>
      <AppEmptyState v-else-if="!connections.length" :description="t.aiConnection.empty" />
      <div v-else class="ai-connection-pool__grid">
        <AiConnectionCard
          v-for="connection in connections"
          :key="connection.id"
          :connection="connection"
          @changed="loadConnections"
        />
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { aiProviderOptions } from '@entities/ai-model';
import { AiConnectionCreateDialog } from '@features/ai-connection-create';
import { t } from '@shared/i18n';
import { AppButton, AppEmptyState, AppLoadingState } from '@shared/ui';

import { useAiConnectionPool } from '../model/useAiConnectionPool';
import AiConnectionCard from './AiConnectionCard.vue';
import AiProviderGrid from './AiProviderGrid.vue';

const { loading, errorMessage, connections, stats, loadConnections } = useAiConnectionPool();

const providerCount = computed(() => aiProviderOptions.length);
</script>

<style scoped>
.ai-connection-pool {
  min-width: 0;
}

.ai-connection-pool__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.ai-connection-pool__head h2 {
  margin: 0;
  color: #111827;
  font-size: 16px;
  font-weight: 700;
}

.ai-connection-pool__head p {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 13px;
}

.ai-connection-pool__head :deep(.arco-btn) {
  height: 38px;
  border-radius: 12px;
}

.ai-connection-pool__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.ai-connection-pool__stats article {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
  padding: 18px 20px;
}

.ai-connection-pool__stats span {
  color: #6b7280;
  font-size: 12px;
}

.ai-connection-pool__stats strong {
  display: block;
  margin-top: 8px;
  color: #2563eb;
  font-size: 26px;
  line-height: 30px;
}

.ai-connection-pool__stats .is-green strong {
  color: #16a34a;
}

.ai-connection-pool__stats .is-red strong {
  color: #dc2626;
}

.ai-connection-pool__stats .is-purple strong {
  color: #7c3aed;
}

.ai-connection-pool__list {
  margin-top: 24px;
}

.ai-connection-pool__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  min-width: 0;
}

@media (max-width: 1100px) {
  .ai-connection-pool__stats,
  .ai-connection-pool__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .ai-connection-pool__head {
    flex-direction: column;
  }

  .ai-connection-pool__stats,
  .ai-connection-pool__grid {
    grid-template-columns: 1fr;
  }
}
</style>
