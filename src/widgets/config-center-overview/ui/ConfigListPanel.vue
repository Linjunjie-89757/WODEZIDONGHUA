<template>
  <AppCard>
    <section class="config-list-panel">
      <header class="config-list-panel__header">
        <h3 class="config-list-panel__title">{{ title }}</h3>
        <div v-if="$slots.actions" class="config-list-panel__actions">
          <slot name="actions" />
        </div>
      </header>
      <div v-if="count > 0" class="config-list-panel__list">
        <slot />
      </div>
      <AppEmptyState v-else :description="emptyText" />
    </section>
  </AppCard>
</template>

<script setup lang="ts">
import { AppCard, AppEmptyState } from '@shared/ui';

defineProps<{
  title: string;
  emptyText: string;
  count: number;
}>();
</script>

<style scoped>
.config-list-panel {
  display: grid;
  gap: var(--app-spacing-md);
  min-width: 0;
}

.config-list-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
}

.config-list-panel__title {
  margin: 0;
  font-size: 15px;
  font-weight: 650;
  line-height: 1.4;
}

.config-list-panel__actions {
  display: flex;
  gap: var(--app-spacing-xs);
}

.config-list-panel__list {
  display: grid;
  gap: var(--app-spacing-sm);
  min-width: 0;
}
</style>
