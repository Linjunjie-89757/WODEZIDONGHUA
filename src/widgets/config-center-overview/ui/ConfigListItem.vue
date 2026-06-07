<template>
  <article class="config-list-item">
    <span class="config-list-item__icon">{{ title.slice(0, 1) }}</span>
    <div class="config-list-item__main">
      <div class="config-list-item__title-row">
        <div class="config-list-item__title">{{ title }}</div>
        <AppStatusBadge
          :label="getConfigStatusLabel(status)"
          :color="getConfigStatusColor(status)"
        />
      </div>
      <div class="config-list-item__subtitle">{{ subtitle }}</div>
      <div class="config-list-item__meta">
        <span>{{ meta }}</span>
      </div>
    </div>
    <div v-if="$slots.actions" class="config-list-item__actions">
      <slot name="actions" />
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
  gap: 14px;
  min-width: 0;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #ffffff;
  padding: 16px;
  transition:
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.config-list-item:hover {
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
  transform: translateY(-1px);
}

.config-list-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 16px;
  font-weight: 800;
}

.config-list-item__main {
  flex: 1;
  min-width: 0;
}

.config-list-item__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.config-list-item__title {
  overflow: hidden;
  color: #111827;
  font-size: 14px;
  font-weight: 650;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.config-list-item__subtitle,
.config-list-item__meta {
  overflow: hidden;
  color: #6b7280;
  font-size: 12px;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.config-list-item__subtitle {
  margin-top: 7px;
  border-radius: 8px;
  background: #f9fafb;
  color: #4b5563;
  font-family: Consolas, "Courier New", monospace;
  padding: 5px 8px;
}

.config-list-item__meta {
  margin-top: 7px;
}

.config-list-item__meta span {
  border-radius: 8px;
  background: #f9fafb;
  padding: 4px 8px;
}

.config-list-item__actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.18s ease;
}

.config-list-item:hover .config-list-item__actions {
  opacity: 1;
}

.config-list-item__actions :deep(.arco-btn) {
  height: 28px;
  border-radius: 8px;
  font-size: 12px;
  padding: 0 8px;
}

@media (max-width: 720px) {
  .config-list-item {
    flex-wrap: wrap;
  }

  .config-list-item__actions {
    width: 100%;
    justify-content: flex-start;
    opacity: 1;
  }
}
</style>
