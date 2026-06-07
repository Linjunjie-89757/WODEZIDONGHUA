<template>
  <AppSection :title="t.aiConnection.title" :description="t.aiConnection.description">
    <template #actions>
      <AiConnectionCreateDialog @success="loadConnections" />
    </template>

    <a-grid :cols="{ xs: 1, sm: 3 }" :col-gap="12" :row-gap="12">
      <a-grid-item>
        <a-statistic :title="t.aiConnection.statsTotal" :value="stats.total" />
      </a-grid-item>
      <a-grid-item>
        <a-statistic :title="t.aiConnection.statsReady" :value="stats.ready" />
      </a-grid-item>
      <a-grid-item>
        <a-statistic :title="t.aiConnection.statsDisabled" :value="stats.disabled" />
      </a-grid-item>
    </a-grid>

    <AiProviderGrid :connections="connections" />

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
  </AppSection>
</template>

<script setup lang="ts">
import { AiConnectionCreateDialog } from '@features/ai-connection-create';
import { t } from '@shared/i18n';
import { AppButton, AppEmptyState, AppLoadingState, AppSection } from '@shared/ui';

import { useAiConnectionPool } from '../model/useAiConnectionPool';
import AiConnectionCard from './AiConnectionCard.vue';
import AiProviderGrid from './AiProviderGrid.vue';

const { loading, errorMessage, connections, stats, loadConnections } = useAiConnectionPool();
</script>

<style scoped>
.ai-connection-pool__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--app-spacing-md);
  min-width: 0;
}
</style>
