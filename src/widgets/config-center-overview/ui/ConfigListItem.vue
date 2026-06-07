<template>
  <article class="config-list-item">
    <div class="config-list-item__main">
      <div class="config-list-item__title">{{ title }}</div>
      <div class="config-list-item__subtitle">{{ subtitle }}</div>
      <div class="config-list-item__meta">{{ meta }}</div>
    </div>
    <div class="config-list-item__side">
      <AppStatusBadge
        :label="getConfigStatusLabel(status)"
        :color="getConfigStatusColor(status)"
      />
      <div v-if="$slots.actions" class="config-list-item__actions">
        <slot name="actions" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { getConfigStatusColor, getConfigStatusLabel } from '@entities/config-center';
import { AppStatusBadge } from '@shared/ui';

defineProps<{
  title: string;
  subtitle?: string;
  meta?: string;
  status?: number;
}>();
</script>

<style scoped>
.config-list-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--app-spacing-md);
  padding: var(--app-spacing-sm) 0;
  min-width: 0;
  border-top: 1px solid var(--app-color-border);
}

.config-list-item:first-child {
  border-top: 0;
}

.config-list-item__main {
  min-width: 0;
}

.config-list-item__side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--app-spacing-sm);
  flex-shrink: 0;
}

.config-list-item__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--app-spacing-xs);
}

.config-list-item__title {
  overflow: hidden;
  font-weight: 650;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.config-list-item__subtitle,
.config-list-item__meta {
  overflow: hidden;
  color: var(--app-color-text-muted);
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
