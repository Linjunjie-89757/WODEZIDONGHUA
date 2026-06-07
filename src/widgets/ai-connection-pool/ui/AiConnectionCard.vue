<template>
  <AppCard>
    <div class="ai-connection-card">
      <div class="ai-connection-card__header">
        <div>
          <div class="ai-connection-card__name">{{ connection.name }}</div>
          <div class="ai-connection-card__meta">{{ connection.model }}</div>
        </div>
        <ProviderBadge :provider="connection.provider" />
      </div>
      <div class="ai-connection-card__url">{{ connection.baseUrl }}</div>
      <div class="ai-connection-card__footer">
        <AppStatusBadge
          :color="connection.status === 'ready' ? 'green' : connection.status === 'error' ? 'red' : 'gray'"
          :label="getAiConnectionStatusLabel(connection.status)"
        />
        <div class="ai-connection-card__actions">
          <AiConnectionTestButton :connection-id="connection.id" />
          <AiConnectionEditDialog :connection="connection" @success="emit('changed')" />
          <AiConnectionDeleteButton :connection-id="connection.id" @success="emit('changed')" />
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { getAiConnectionStatusLabel, ProviderBadge, type AiConnection } from '@entities/ai-model';
import { AiConnectionDeleteButton } from '@features/ai-connection-delete';
import { AiConnectionEditDialog } from '@features/ai-connection-edit';
import { AiConnectionTestButton } from '@features/ai-connection-test';
import { AppCard, AppStatusBadge } from '@shared/ui';

defineProps<{
  connection: AiConnection;
}>();

const emit = defineEmits<{
  changed: [];
}>();
</script>

<style scoped>
.ai-connection-card {
  display: grid;
  gap: var(--app-spacing-md);
  min-width: 0;
}

.ai-connection-card__header,
.ai-connection-card__footer {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--app-spacing-md);
}

.ai-connection-card__name {
  font-weight: 650;
  line-height: 1.4;
}

.ai-connection-card__meta,
.ai-connection-card__url {
  color: var(--app-color-text-muted);
  line-height: 1.5;
}

.ai-connection-card__url {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ai-connection-card__actions {
  display: flex;
  gap: var(--app-spacing-xs);
}
</style>
