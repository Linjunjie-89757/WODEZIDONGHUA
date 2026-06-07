<template>
  <div class="case-readonly-list">
    <AppEmptyState v-if="!cases.length" :description="t.caseCenter.caseEmpty" />
    <div v-else class="case-readonly-list__table-wrap">
      <table class="case-readonly-list__table">
        <thead>
          <tr>
            <th>{{ t.caseCenter.fieldCaseNo }}</th>
            <th>{{ t.caseCenter.fieldTitle }}</th>
            <th>{{ t.caseCenter.fieldStatus }}</th>
            <th>{{ t.caseCenter.fieldPriority }}</th>
            <th>{{ t.caseCenter.fieldReviewStatus }}</th>
            <th>{{ t.caseCenter.fieldExecutionStatus }}</th>
            <th>{{ t.caseCenter.fieldOwner }}</th>
            <th>{{ t.caseCenter.fieldDirectory }}</th>
            <th class="case-readonly-list__action-head">{{ t.common.actions }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="caseItem in cases" :key="caseItem.id">
            <td>
              <span class="case-readonly-list__case-no">{{ caseItem.caseNo }}</span>
            </td>
            <td>
              <div class="case-readonly-list__title" :title="caseItem.title">{{ caseItem.title }}</div>
            </td>
            <td>
              <span class="case-readonly-list__badge case-readonly-list__badge--status">
                {{ caseItem.status }}
              </span>
            </td>
            <td>
              <span class="case-readonly-list__badge case-readonly-list__badge--priority">
                {{ caseItem.priority }}
              </span>
            </td>
            <td>
              <span class="case-readonly-list__badge case-readonly-list__badge--muted">
                {{ caseItem.reviewStatus }}
              </span>
            </td>
            <td>
              <span class="case-readonly-list__badge case-readonly-list__badge--execution">
                {{ caseItem.executionStatus }}
              </span>
            </td>
            <td>{{ caseItem.ownerName || '-' }}</td>
            <td>
              <span class="case-readonly-list__directory">
                {{ caseItem.directoryName || t.caseCenter.allDirectories }}
              </span>
            </td>
            <td class="case-readonly-list__actions">
              <CaseEditDialog :case-item="caseItem" @success="emit('success')" />
              <CaseDeleteButton
                :case-id="caseItem.id"
                :workspace-code="caseItem.workspaceCode"
                @success="emit('success')"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CaseSummaryItem } from '@entities/case-center';
import { t } from '@shared/i18n';
import { AppEmptyState } from '@shared/ui';
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
.case-readonly-list {
  min-width: 0;
}

.case-readonly-list__table-wrap {
  min-width: 0;
  overflow-x: auto;
}

.case-readonly-list__table {
  width: 100%;
  min-width: 980px;
  border-collapse: collapse;
}

.case-readonly-list__table thead {
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.case-readonly-list__table th {
  height: 40px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  padding: 0 20px;
  text-align: left;
  white-space: nowrap;
}

.case-readonly-list__table td {
  height: 48px;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
  font-size: 13px;
  padding: 8px 20px;
  vertical-align: middle;
  white-space: nowrap;
}

.case-readonly-list__table tbody tr {
  transition: background 0.18s ease;
}

.case-readonly-list__table tbody tr:hover {
  background: #f9fafb;
}

.case-readonly-list__case-no {
  color: #2563eb;
  font-weight: 600;
}

.case-readonly-list__title {
  max-width: 280px;
  overflow: hidden;
  color: #111827;
  font-size: 13px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.case-readonly-list__directory {
  display: inline-block;
  max-width: 180px;
  overflow: hidden;
  color: #6b7280;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.case-readonly-list__badge {
  display: inline-flex;
  align-items: center;
  height: 22px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  padding: 0 9px;
}

.case-readonly-list__badge--status {
  border-color: #bbf7d0;
  background: #f0fdf4;
  color: #15803d;
}

.case-readonly-list__badge--priority {
  border-color: #fed7aa;
  background: #fff7ed;
  color: #c2410c;
}

.case-readonly-list__badge--muted {
  border-color: #e5e7eb;
  background: #f9fafb;
  color: #6b7280;
}

.case-readonly-list__badge--execution {
  border-color: #bfdbfe;
  background: #eff6ff;
  color: #2563eb;
}

.case-readonly-list__action-head,
.case-readonly-list__actions {
  position: sticky;
  right: 0;
  z-index: 1;
  border-left: 1px solid #e5e7eb;
  text-align: center;
}

.case-readonly-list__action-head {
  background: #f9fafb;
}

.case-readonly-list__actions {
  background: #ffffff;
}

.case-readonly-list__table tbody tr:hover .case-readonly-list__actions {
  background: #f9fafb;
}

.case-readonly-list__actions :deep(.arco-btn) {
  height: 28px;
  border-radius: 6px;
  font-size: 13px;
  padding: 0 6px;
}

@media (max-width: 768px) {
  .case-readonly-list__table {
    min-width: 920px;
  }
}
</style>
