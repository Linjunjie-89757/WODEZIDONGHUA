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
        <div class="api-definition-list__meta">
          <span>{{ t.apiAutomation.updatedAt }}: {{ definition.updatedAt || '-' }}</span>
          <span>{{ t.apiAutomation.lastRunResult }}: {{ definition.lastRunResult || '-' }}</span>
        </div>
        <div class="api-definition-list__actions" @click.stop>
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
  gap: var(--app-spacing-sm);
}

.api-definition-list__item {
  display: grid;
  gap: 10px;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: var(--app-color-bg);
  cursor: pointer;
  padding: var(--app-spacing-md);
}

.api-definition-list__item--active {
  border-color: rgb(var(--primary-6));
  box-shadow: 0 0 0 2px rgba(var(--primary-6), 0.12);
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
  align-items: flex-start;
}

.api-definition-list__content {
  min-width: 0;
}

.api-definition-list__content h3,
.api-definition-list__content p {
  margin: 0;
}

.api-definition-list__content h3 {
  font-size: 15px;
  font-weight: 650;
}

.api-definition-list__content p,
.api-definition-list__meta {
  color: var(--app-color-text-muted);
}

.api-definition-list__content p {
  margin-top: 4px;
  overflow-wrap: anywhere;
}

.api-definition-list__meta {
  flex-wrap: wrap;
  font-size: 12px;
}

.api-definition-list__actions {
  justify-content: flex-end;
  flex-wrap: wrap;
}
</style>
