<template>
  <div class="case-readonly-list">
    <AppEmptyState v-if="!cases.length" :description="t.caseCenter.caseEmpty" />
    <div v-else class="case-readonly-list__table-wrap">
      <table class="case-readonly-list__table">
        <thead>
          <tr>
            <th>{{ t.caseCenter.fieldCaseNo }}</th>
            <th>{{ t.caseCenter.fieldCaseName }}</th>
            <th>{{ t.caseCenter.fieldStatus }}</th>
            <th>{{ t.caseCenter.fieldPriority }}</th>
            <th>{{ t.caseCenter.fieldValidationMode }}</th>
            <th>{{ t.caseCenter.fieldExecutor }}</th>
            <th>{{ t.caseCenter.fieldWorkspace }}</th>
            <th>{{ t.caseCenter.fieldCasePath }}</th>
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
              <span :class="['case-readonly-list__badge', statusClass(caseItem.status)]">
                {{ caseItem.status }}
              </span>
            </td>
            <td>
              <span :class="['case-readonly-list__priority', priorityClass(caseItem.priority)]">
                {{ caseItem.priority }}
              </span>
            </td>
            <td>
              <span class="case-readonly-list__text-muted">
                {{ caseItem.sourceType || '-' }}
              </span>
            </td>
            <td>
              <span class="case-readonly-list__text-muted">
                {{ caseItem.executorName || caseItem.ownerName || '-' }}
              </span>
            </td>
            <td>{{ caseItem.workspaceName || caseItem.workspaceCode || '-' }}</td>
            <td>
              <span class="case-readonly-list__directory">
                {{ caseItem.directoryName || t.caseCenter.allDirectories }}
              </span>
            </td>
            <td class="case-readonly-list__actions">
              <div class="case-readonly-list__action-row">
                <CaseEditDialog :case-item="caseItem" @success="emit('success')" />
                <button
                  class="case-readonly-list__link is-disabled"
                  type="button"
                  :title="t.caseCenter.unsupportedActionHint"
                >
                  {{ t.common.execute }}
                </button>
                <a-dropdown trigger="click" position="bottom">
                  <button
                    class="case-readonly-list__more"
                    type="button"
                    :aria-label="t.caseCenter.moreActions"
                  >
                    <span></span>
                  </button>
                  <template #content>
                    <div class="case-readonly-list__menu">
                      <button type="button" disabled>
                        <span class="case-readonly-list__menu-icon is-review"></span>
                        {{ t.caseCenter.reviewAction }}
                      </button>
                      <button type="button" disabled>
                        <span class="case-readonly-list__menu-icon is-bug"></span>
                        {{ t.caseCenter.createBugAction }}
                      </button>
                      <button type="button" disabled>
                        <span class="case-readonly-list__menu-icon is-copy"></span>
                        {{ t.caseCenter.copyAction }}
                      </button>
                      <CaseDeleteButton
                        class="case-readonly-list__delete-action"
                        :case-id="caseItem.id"
                        :workspace-code="caseItem.workspaceCode"
                        @success="emit('success')"
                      />
                    </div>
                  </template>
                </a-dropdown>
              </div>
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

function statusClass(status: string) {
  const normalized = status.toUpperCase();

  if (['PASSED', 'PASS', 'ACTIVE', 'ENABLED'].includes(normalized) || status === '通过') {
    return 'case-readonly-list__badge--success';
  }

  if (['FAILED', 'FAIL', 'DISABLED', 'INACTIVE'].includes(normalized) || status === '失败') {
    return 'case-readonly-list__badge--danger';
  }

  return 'case-readonly-list__badge--neutral';
}

function priorityClass(priority: string) {
  switch (priority.toUpperCase()) {
    case 'P0':
      return 'case-readonly-list__priority--p0';
    case 'P1':
      return 'case-readonly-list__priority--p1';
    case 'P2':
      return 'case-readonly-list__priority--p2';
    default:
      return 'case-readonly-list__priority--default';
  }
}
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
  min-width: 1080px;
  border-collapse: collapse;
  table-layout: fixed;
}

.case-readonly-list__table thead {
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.case-readonly-list__table th {
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  padding: 12px 20px;
  text-align: left;
  white-space: nowrap;
}

.case-readonly-list__table td {
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
  font-size: 14px;
  padding: 14px 20px;
  vertical-align: middle;
  white-space: nowrap;
}

.case-readonly-list__table th:nth-child(1),
.case-readonly-list__table td:nth-child(1) {
  width: 132px;
}

.case-readonly-list__table th:nth-child(2),
.case-readonly-list__table td:nth-child(2) {
  width: 240px;
}

.case-readonly-list__table th:nth-child(3),
.case-readonly-list__table td:nth-child(3),
.case-readonly-list__table th:nth-child(4),
.case-readonly-list__table td:nth-child(4) {
  width: 96px;
}

.case-readonly-list__table th:nth-child(5),
.case-readonly-list__table td:nth-child(5),
.case-readonly-list__table th:nth-child(6),
.case-readonly-list__table td:nth-child(6) {
  width: 112px;
}

.case-readonly-list__table th:nth-child(7),
.case-readonly-list__table td:nth-child(7) {
  width: 138px;
}

.case-readonly-list__table th:nth-child(8),
.case-readonly-list__table td:nth-child(8) {
  width: 180px;
}

.case-readonly-list__table tbody tr {
  transition: background 0.18s ease;
}

.case-readonly-list__table tbody tr:hover {
  background: #f9fafb;
}

.case-readonly-list__case-no {
  color: #2563eb;
  font-size: 14px;
  font-weight: 650;
}

.case-readonly-list__title {
  overflow: hidden;
  color: #111827;
  font-size: 14px;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.case-readonly-list__directory {
  display: inline-block;
  max-width: 140px;
  overflow: hidden;
  color: #6b7280;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.case-readonly-list__text-muted {
  color: #6b7280;
}

.case-readonly-list__badge {
  display: inline-flex;
  align-items: center;
  height: 22px;
  border: 1px solid;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  padding: 0 9px;
}

.case-readonly-list__badge--success {
  border-color: #bbf7d0;
  background: #f0fdf4;
  color: #15803d;
}

.case-readonly-list__badge--danger {
  border-color: #fecaca;
  background: #fef2f2;
  color: #b91c1c;
}

.case-readonly-list__badge--neutral {
  border-color: #e5e7eb;
  background: #f9fafb;
  color: #374151;
}

.case-readonly-list__priority {
  display: inline-flex;
  align-items: center;
  height: 22px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  padding: 0 9px;
}

.case-readonly-list__priority--p0 {
  background: #fee2e2;
  color: #b91c1c;
}

.case-readonly-list__priority--p1 {
  background: #ffedd5;
  color: #c2410c;
}

.case-readonly-list__priority--p2 {
  background: #fef3c7;
  color: #a16207;
}

.case-readonly-list__priority--default {
  background: #f3f4f6;
  color: #374151;
}

.case-readonly-list__action-head,
.case-readonly-list__actions {
  position: sticky;
  right: 0;
  z-index: 1;
  border-left: 1px solid #e5e7eb;
  text-align: center;
  width: 160px;
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

.case-readonly-list__action-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.case-readonly-list__actions :deep(.arco-btn),
.case-readonly-list__link {
  height: 24px;
  border: 0;
  background: transparent;
  color: #2563eb;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  padding: 0;
}

.case-readonly-list__actions :deep(.arco-btn:hover),
.case-readonly-list__link:hover {
  color: #1d4ed8;
}

.case-readonly-list__link.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.case-readonly-list__more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  transition:
    background 0.18s ease,
    color 0.18s ease;
}

.case-readonly-list__more:hover {
  background: #f3f4f6;
  color: #4b5563;
}

.case-readonly-list__more span,
.case-readonly-list__more span::before,
.case-readonly-list__more span::after {
  width: 3px;
  height: 3px;
  border-radius: 999px;
  background: currentColor;
}

.case-readonly-list__more span {
  position: relative;
}

.case-readonly-list__more span::before,
.case-readonly-list__more span::after {
  content: "";
  position: absolute;
  top: 0;
}

.case-readonly-list__more span::before {
  left: -6px;
}

.case-readonly-list__more span::after {
  right: -6px;
}

.case-readonly-list__menu {
  width: 128px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.14);
  padding: 4px 0;
}

.case-readonly-list__menu button,
.case-readonly-list__menu :deep(.arco-btn) {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  width: 100%;
  height: 34px;
  border: 0;
  border-radius: 0;
  background: #ffffff;
  color: #374151;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  padding: 0 12px;
  text-align: left;
}

.case-readonly-list__menu button:hover,
.case-readonly-list__menu :deep(.arco-btn:hover) {
  background: #f9fafb;
}

.case-readonly-list__menu button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.case-readonly-list__menu :deep(.arco-btn) {
  color: #dc2626;
}

.case-readonly-list__menu :deep(.arco-btn:hover) {
  background: #fef2f2;
  color: #b91c1c;
}

.case-readonly-list__menu-icon {
  position: relative;
  width: 14px;
  height: 14px;
  color: #9ca3af;
}

.case-readonly-list__menu-icon::before {
  content: "";
  position: absolute;
  inset: 2px;
  border: 1.5px solid currentColor;
  border-radius: 3px;
}

.case-readonly-list__menu-icon.is-bug::before {
  border-radius: 999px;
}

.case-readonly-list__menu-icon.is-copy::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 8px;
  height: 8px;
  border: 1.5px solid currentColor;
  border-radius: 2px;
}

@media (max-width: 768px) {
  .case-readonly-list__table {
    min-width: 1080px;
  }
}
</style>
