<template>
  <div class="api-definition-list" data-testid="api-definition-list">
    <AppEmptyState v-if="!definitions.length" :title="t.apiAutomation.emptyDefinitions" />
    <div v-else class="api-definition-list__items">
      <article
        v-for="definition in definitions"
        :key="definition.id"
        :class="[
          'api-definition-list__item',
          { 'api-definition-list__item--active': definition.id === selectedId }
        ]"
        data-testid="api-definition-row"
        @click="$emit('select', definition.id)"
      >
        <div class="api-definition-list__main">
          <a-tag size="small" color="arcoblue">{{ definition.method }}</a-tag>
          <div class="api-definition-list__content">
            <h3>{{ definition.name }}</h3>
            <p>{{ definition.path }}</p>
          </div>
        </div>
        <div class="api-definition-list__actions" @click.stop>
          <span class="api-definition-list__meta">{{ definition.updatedAt || '-' }}</span>
          <span class="api-definition-list__meta">{{ definition.lastRunResult || '-' }}</span>
          <AppButton type="text" data-testid="api-definition-edit" @click="$emit('edit', definition.id)">
            {{ t.apiAutomation.edit }}
          </AppButton>
          <AppButton type="text" data-testid="api-definition-debug" @click="$emit('select', definition.id)">
            {{ t.apiAutomation.debug }}
          </AppButton>
          <ApiDefinitionDeleteButton :definition-id="definition.id" @success="$emit('success')" />
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiDefinitionItem } from '@entities/api-automation';
import { ApiDefinitionDeleteButton } from '@features/api-definition-delete';
import { t } from '@shared/i18n';
import { AppButton, AppEmptyState } from '@shared/ui';

defineProps<{
  definitions: ApiDefinitionItem[];
  selectedId?: number | null;
}>();

defineEmits<{
  select: [id: number];
  edit: [id: number];
  success: [];
}>();
</script>

<style scoped>
.api-definition-list {
  min-width: 0;
}

.api-definition-list__items {
  display: grid;
  gap: 0;
  overflow: hidden;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
}

.api-definition-list__item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--app-spacing-sm);
  align-items: center;
  border-bottom: 1px solid var(--app-color-border);
  background: var(--app-color-bg);
  cursor: pointer;
  padding: 9px 10px;
}

.api-definition-list__item:last-child {
  border-bottom: 0;
}

.api-definition-list__item--active {
  background: rgba(var(--primary-6), 0.06);
  box-shadow: inset 3px 0 0 rgb(var(--primary-6));
}

.api-definition-list__main,
.api-definition-list__actions,
.api-definition-list__meta {
  display: flex;
  align-items: center;
  gap: var(--app-spacing-sm);
  min-width: 0;
}

.api-definition-list__main {
  align-items: center;
}

.api-definition-list__content {
  min-width: 0;
}

.api-definition-list__content h3,
.api-definition-list__content p {
  margin: 0;
}

.api-definition-list__content h3 {
  overflow: hidden;
  color: var(--app-color-text);
  font-size: 14px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-definition-list__content p,
.api-definition-list__meta {
  color: var(--app-color-text-muted);
}

.api-definition-list__content p {
  margin-top: 2px;
  font-size: 12px;
  overflow-wrap: anywhere;
}

.api-definition-list__meta {
  color: var(--app-color-text-muted);
  font-size: 12px;
  white-space: nowrap;
}

.api-definition-list__actions {
  justify-content: flex-end;
  flex-wrap: wrap;
}

@media (max-width: 760px) {
  .api-definition-list__item {
    grid-template-columns: 1fr;
  }
}
</style>
