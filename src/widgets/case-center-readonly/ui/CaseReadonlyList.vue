<template>
  <div class="case-readonly-list">
    <AppEmptyState v-if="!cases.length" :description="t.caseCenter.caseEmpty" />
    <div v-else class="case-readonly-list__items">
      <article v-for="caseItem in cases" :key="caseItem.id" class="case-readonly-list__item">
        <div class="case-readonly-list__main">
          <div class="case-readonly-list__title">
            <span class="case-readonly-list__case-no">{{ caseItem.caseNo }}</span>
            <span>{{ caseItem.title }}</span>
          </div>
          <div class="case-readonly-list__meta">
            <span>{{ t.caseCenter.fieldDirectory }}: {{ caseItem.directoryName || t.caseCenter.allDirectories }}</span>
            <span>{{ t.caseCenter.fieldOwner }}: {{ caseItem.ownerName || '-' }}</span>
          </div>
        </div>
        <div class="case-readonly-list__badges">
          <AppStatusBadge :label="caseItem.priority" color="blue" />
          <AppStatusBadge :label="caseItem.status" color="green" />
          <AppStatusBadge :label="caseItem.reviewStatus" color="gray" />
          <AppStatusBadge :label="caseItem.executionStatus" color="orange" />
          <CaseEditDialog :case-item="caseItem" @success="emit('success')" />
          <CaseDeleteButton
            :case-id="caseItem.id"
            :workspace-code="caseItem.workspaceCode"
            @success="emit('success')"
          />
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CaseSummaryItem } from '@entities/case-center';
import { t } from '@shared/i18n';
import { AppEmptyState, AppStatusBadge } from '@shared/ui';
import { CaseDeleteButton } from '@features/case-delete';
import { CaseEditDialog } from '@features/case-edit';

defineProps<{
  cases: CaseSummaryItem[];
}>();

const emit = defineEmits<{
  success: [];
}>();
</script>

<style scoped>
.case-readonly-list__items {
  display: grid;
  gap: var(--app-spacing-sm);
}

.case-readonly-list__item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--app-spacing-md);
  align-items: center;
  min-width: 0;
  padding: 12px 0;
  border-bottom: 1px solid var(--app-color-border);
}

.case-readonly-list__item:last-child {
  border-bottom: 0;
}

.case-readonly-list__main {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.case-readonly-list__title {
  display: flex;
  gap: 8px;
  min-width: 0;
  color: var(--app-color-text);
  font-weight: 600;
}

.case-readonly-list__title span:last-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.case-readonly-list__case-no {
  flex: 0 0 auto;
  color: var(--app-color-text-secondary);
  font-weight: 500;
}

.case-readonly-list__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  min-width: 0;
  color: var(--app-color-text-secondary);
  font-size: 13px;
}

.case-readonly-list__badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
  max-width: 360px;
}

@media (max-width: 768px) {
  .case-readonly-list__item {
    grid-template-columns: 1fr;
  }

  .case-readonly-list__badges {
    justify-content: flex-start;
    max-width: none;
  }
}
</style>
