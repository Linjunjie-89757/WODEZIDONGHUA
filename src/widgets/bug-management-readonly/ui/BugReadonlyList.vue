<template>
  <div class="bug-readonly-list">
    <AppEmptyState v-if="!bugs.length" :description="t.bugManagement.empty" />
    <div v-else class="bug-readonly-list__items">
      <article
        v-for="bug in bugs"
        :key="bug.id"
        class="bug-readonly-list__item"
        @click="emit('select', bug)"
      >
        <span class="bug-readonly-list__main">
          <span class="bug-readonly-list__title">
            <span class="bug-readonly-list__bug-no">{{ bug.bugNo }}</span>
            <span>{{ bug.title }}</span>
          </span>
          <span class="bug-readonly-list__meta">
            <span>{{ t.bugManagement.fieldAssignee }}: {{ bug.assigneeName || '-' }}</span>
            <span>{{ t.bugManagement.fieldReporter }}: {{ bug.reporterName || '-' }}</span>
            <span>{{ t.bugManagement.fieldUpdatedAt }}: {{ bug.updatedAt || bug.createdAt || '-' }}</span>
          </span>
        </span>
        <span class="bug-readonly-list__badges">
          <AppStatusBadge :label="bug.priority" color="blue" />
          <AppStatusBadge :label="bug.severity" color="orange" />
          <AppStatusBadge :label="bug.status" color="green" />
          <BugEditDialog :bug="bug" @success="emit('success')" />
        </span>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BugSummary } from '@entities/bug';
import { t } from '@shared/i18n';
import { AppEmptyState, AppStatusBadge } from '@shared/ui';
import { BugEditDialog } from '@features/bug-edit';

defineProps<{
  bugs: BugSummary[];
}>();

const emit = defineEmits<{
  select: [bug: BugSummary];
  success: [];
}>();
</script>

<style scoped>
.bug-readonly-list__items {
  display: grid;
  gap: var(--app-spacing-sm);
}

.bug-readonly-list__item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--app-spacing-md);
  align-items: center;
  min-width: 0;
  padding: 12px 0;
  color: inherit;
  text-align: left;
  background: transparent;
  border-bottom: 1px solid var(--app-color-border);
  cursor: pointer;
}

.bug-readonly-list__item:last-child {
  border-bottom: 0;
}

.bug-readonly-list__item:hover .bug-readonly-list__title {
  color: rgb(var(--primary-6));
}

.bug-readonly-list__main {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.bug-readonly-list__title {
  display: flex;
  gap: 8px;
  min-width: 0;
  color: var(--app-color-text);
  font-weight: 600;
}

.bug-readonly-list__title span:last-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bug-readonly-list__bug-no {
  flex: 0 0 auto;
  color: var(--app-color-text-secondary);
  font-weight: 500;
}

.bug-readonly-list__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  min-width: 0;
  color: var(--app-color-text-secondary);
  font-size: 13px;
}

.bug-readonly-list__badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
  max-width: 280px;
}

@media (max-width: 768px) {
  .bug-readonly-list__item {
    grid-template-columns: 1fr;
  }

  .bug-readonly-list__badges {
    justify-content: flex-start;
    max-width: none;
  }
}
</style>
