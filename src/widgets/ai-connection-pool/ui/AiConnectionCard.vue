<template>
  <article class="ai-connection-card">
    <div class="ai-connection-card__logo">{{ providerInitial }}</div>
    <div class="ai-connection-card__body">
      <div class="ai-connection-card__header">
        <div class="ai-connection-card__title">
          <strong>{{ connection.name }}</strong>
          <AppStatusBadge
            :color="connection.status === 'ready' ? 'green' : connection.status === 'error' ? 'red' : 'gray'"
            :label="getAiConnectionStatusLabel(connection.status)"
          />
        </div>
        <ProviderBadge :provider="connection.provider" />
      </div>
      <div class="ai-connection-card__model">{{ connection.model }}</div>
      <div class="ai-connection-card__url">{{ connection.baseUrl }}</div>
      <div class="ai-connection-card__meta">
        <span>{{ t.aiConnection.createdAtLabel }} {{ connection.lastVerifiedAt || '-' }}</span>
      </div>
    </div>
    <div class="ai-connection-card__actions">
      <AiConnectionTestButton :connection-id="connection.id" />
      <AiConnectionEditDialog :connection="connection" @success="emit('changed')" />
      <AiConnectionDeleteButton :connection-id="connection.id" @success="emit('changed')" />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { getAiConnectionStatusLabel, ProviderBadge, type AiConnection } from '@entities/ai-model';
import { AiConnectionDeleteButton } from '@features/ai-connection-delete';
import { AiConnectionEditDialog } from '@features/ai-connection-edit';
import { AiConnectionTestButton } from '@features/ai-connection-test';
import { t } from '@shared/i18n';
import { AppStatusBadge } from '@shared/ui';

const props = defineProps<{
  connection: AiConnection;
}>();

const emit = defineEmits<{
  changed: [];
}>();

const providerInitial = computed(() => props.connection.name.slice(0, 1).toUpperCase());
</script>

<style scoped>
.ai-connection-card {
  display: flex;
  position: relative;
  align-items: flex-start;
  min-width: 0;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
  gap: 16px;
  padding: 20px;
  transition:
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.ai-connection-card:hover {
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
  transform: translateY(-1px);
}

.ai-connection-card__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 14px;
  background: #111827;
  color: #ffffff;
  font-size: 18px;
  font-weight: 800;
}

.ai-connection-card__body {
  flex: 1;
  min-width: 0;
}

.ai-connection-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.ai-connection-card__title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}

.ai-connection-card__title strong {
  color: #111827;
  font-size: 14px;
  font-weight: 650;
}

.ai-connection-card__model {
  display: inline-flex;
  max-width: 100%;
  overflow: hidden;
  margin-top: 8px;
  border-radius: 7px;
  background: #f9fafb;
  color: #4b5563;
  font-family: Consolas, "Courier New", monospace;
  font-size: 12px;
  padding: 3px 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ai-connection-card__url {
  overflow: hidden;
  margin-top: 8px;
  color: #9ca3af;
  font-family: Consolas, "Courier New", monospace;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ai-connection-card__meta {
  margin-top: 6px;
  color: #9ca3af;
  font-size: 12px;
}

.ai-connection-card__actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.18s ease;
}

.ai-connection-card:hover .ai-connection-card__actions {
  opacity: 1;
}

.ai-connection-card__actions :deep(.arco-btn) {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  font-size: 12px;
  padding: 0;
}

.ai-connection-card__actions :deep(.arco-btn span:not(.arco-icon)) {
  overflow: hidden;
  width: 0;
  white-space: nowrap;
}

@media (max-width: 720px) {
  .ai-connection-card {
    padding: 16px;
  }

  .ai-connection-card__actions {
    opacity: 1;
  }
}
</style>
