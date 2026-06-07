<template>
  <section class="api-case-management" data-testid="api-case-management">
    <header class="api-case-management__header">
      <div>
        <h3>{{ t.apiAutomation.caseSection }}</h3>
        <p>{{ selectedDefinitionName || t.apiAutomation.caseSelectDefinition }}</p>
      </div>
      <div class="api-case-management__actions">
        <AppButton type="text" :loading="loading" @click="loadCases">{{ t.common.retry }}</AppButton>
        <AppButton
          type="primary"
          :disabled="!definitionId"
          data-testid="api-case-create"
          @click="openCreateDialog"
        >
          {{ t.apiAutomation.caseCreate }}
        </AppButton>
      </div>
    </header>

    <a-alert v-if="errorMessage" type="error" show-icon>
      <template #title>{{ errorMessage }}</template>
    </a-alert>

    <AppLoadingState v-if="loading" />
    <div v-else-if="!cases.length" class="api-case-management__empty">
      {{ definitionId ? t.apiAutomation.caseEmpty : t.apiAutomation.caseSelectDefinition }}
    </div>
    <div v-else class="api-case-management__density-shell" data-testid="api-case-list-density-shell">
      <div class="api-case-management__list" data-testid="api-case-list">
        <div class="api-case-management__list-head">
          <span>ID</span>
          <span>{{ t.apiAutomation.caseName }}</span>
          <span>{{ t.apiAutomation.fieldMethod }}</span>
          <span>{{ t.apiAutomation.casePriority }}</span>
          <span>{{ t.apiAutomation.fieldStatus }}</span>
          <span>{{ t.apiAutomation.fieldPath }}</span>
          <span></span>
        </div>
        <article
          v-for="item in cases"
          :key="item.id"
          class="api-case-management__row"
          data-testid="api-case-row"
          @click="selectCase(item.id)"
        >
          <small>{{ item.id }}</small>
          <button type="button" class="api-case-management__row-main" @click.stop="selectCase(item.id)">
            <strong>{{ item.name }}</strong>
            <small>{{ item.description || selectedDefinitionName || '-' }}</small>
          </button>
          <small>{{ item.method || '-' }}</small>
          <small>{{ item.priority || '-' }}</small>
          <small>{{ item.status || '-' }}</small>
          <small class="api-case-management__path">{{ item.path || '-' }}</small>
          <div class="api-case-management__row-actions" @click.stop>
            <AppButton type="text" data-testid="api-case-detail-entry" @click="selectCase(item.id)">
              {{ t.common.detail }}
            </AppButton>
            <ApiCaseRunButton
              :case-id="item.id"
              :environment-id="environmentId"
              :variable-set-id="variableSetId"
              @success="setRunResult"
            />
            <AppButton type="text" data-testid="api-case-edit" @click="openEditDialog(item.id)">
              {{ t.common.edit }}
            </AppButton>
            <ApiCaseDeleteButton :case-id="item.id" @success="loadCases" />
          </div>
        </article>
      </div>
      <footer class="api-case-management__pagination" data-testid="api-case-list-pagination">
        <span>{{ t.apiAutomation.caseListTotal }} {{ cases.length }}</span>
        <span>{{ selectedDefinitionName || t.apiAutomation.caseSelectDefinition }}</span>
      </footer>
    </div>

    <AppDrawer
      v-model:visible="detailVisible"
      :title="selectedCase?.name || t.apiAutomation.caseDetailTitle"
      width="920"
    >
      <a-spin :loading="detailLoading">
        <div class="api-case-management__drawer" data-testid="api-case-detail">
          <header class="api-case-management__drawer-head">
            <div class="api-case-management__drawer-heading">
              <strong>{{ selectedCaseDetail?.name || selectedCase?.name || t.apiAutomation.caseDetailTitle }}</strong>
              <small>{{ selectedCaseDetail?.definitionName || selectedDefinitionName || '-' }}</small>
            </div>
            <div class="api-case-management__drawer-summary">
              <span class="api-case-management__method">{{ selectedCaseDetail?.requestConfig?.method || selectedCase?.method || '-' }}</span>
              <span class="api-case-management__summary-path">{{ selectedCaseDetail?.requestConfig?.path || selectedCase?.path || '-' }}</span>
            </div>
          </header>

          <div class="api-case-management__view-tabs" data-testid="api-case-drawer-view-tabs">
            <button
              type="button"
              :class="{ active: activeDrawerTab === 'detail' }"
              data-testid="api-case-drawer-detail-tab"
              @click="activeDrawerTab = 'detail'"
            >
              {{ t.common.detail }}
            </button>
            <button
              type="button"
              :class="{ active: activeDrawerTab === 'runHistory' }"
              data-testid="api-case-drawer-run-history-tab"
              @click="activeDrawerTab = 'runHistory'"
            >
              {{ t.apiAutomation.caseRunHistory }}
            </button>
            <button
              type="button"
              :class="{ active: activeDrawerTab === 'changeHistory' }"
              data-testid="api-case-drawer-change-history-tab"
              @click="activeDrawerTab = 'changeHistory'"
            >
              {{ t.apiAutomation.caseChangeHistory }}
            </button>
          </div>

          <section v-if="activeDrawerTab === 'detail'" class="api-case-management__drawer-panel">
            <a-descriptions :column="2" bordered size="small" class="api-case-management__meta">
              <a-descriptions-item :label="t.apiAutomation.fieldMethod">
                {{ selectedCaseDetail?.requestConfig?.method || '-' }}
              </a-descriptions-item>
              <a-descriptions-item :label="t.apiAutomation.fieldPath">
                {{ selectedCaseDetail?.requestConfig?.path || '-' }}
              </a-descriptions-item>
              <a-descriptions-item :label="t.apiAutomation.casePriority">
                {{ selectedCaseDetail?.priority || '-' }}
              </a-descriptions-item>
              <a-descriptions-item :label="t.apiAutomation.fieldStatus">
                {{ selectedCaseDetail?.status || '-' }}
              </a-descriptions-item>
              <a-descriptions-item :label="t.apiAutomation.fieldDescription">
                {{ selectedCaseDetail?.description || '-' }}
              </a-descriptions-item>
            </a-descriptions>

            <section v-if="runResult" data-testid="api-case-run-result">
              <h4 class="api-case-management__drawer-title">{{ t.apiAutomation.caseRunResult }}</h4>
              <ApiRunResultPanel :result="runResult" />
            </section>
            <div v-else class="api-case-management__response-placeholder" data-testid="api-case-run-result-empty">
              <ApiRunResultPanel :result="null" />
            </div>
          </section>

          <section
            v-else-if="activeDrawerTab === 'runHistory'"
            class="api-case-management__drawer-panel"
            data-testid="api-case-run-history"
          >
            <div v-if="selectedRunHistoryDetail" class="api-case-management__history-detail" data-testid="api-case-run-history-detail">
              <header class="api-case-management__history-detail-head">
                <AppButton type="text" data-testid="api-case-run-history-back" @click="backToRunHistoryList">
                  {{ t.apiAutomation.caseRunHistoryBack }}
                </AppButton>
                <div class="api-case-management__history-metrics">
                  <span>{{ selectedRunHistoryDetail.result || '-' }}</span>
                  <span>{{ selectedRunHistoryDetail.durationMs ?? '-' }} ms</span>
                  <span>{{ selectedRunHistoryDetail.createdAt || '-' }}</span>
                </div>
              </header>
              <ApiRunResultPanel :result="historyDetailRunResult" />
            </div>
            <template v-else>
              <div v-if="!runHistory.length" class="api-case-management__empty">
                {{ t.apiAutomation.caseRunHistoryEmpty }}
              </div>
              <div v-else class="api-case-management__history-table">
                <div class="api-case-management__history-head">
                  <span>{{ t.apiAutomation.caseRunHistoryTime }}</span>
                  <span>{{ t.apiAutomation.caseRunHistoryResult }}</span>
                  <span>{{ t.apiAutomation.responseDuration }}</span>
                  <span>{{ t.common.detail }}</span>
                </div>
                <article
                  v-for="history in runHistory"
                  :key="history.id"
                  class="api-case-management__history-row"
                  data-testid="api-case-run-history-row"
                >
                  <span>{{ history.createdAt || '-' }}</span>
                  <strong :class="resultToneClass(history.result)">{{ history.result || '-' }}</strong>
                  <span>{{ history.durationMs ?? '-' }} ms</span>
                  <AppButton type="text" data-testid="api-case-run-history-detail-entry" @click="selectRunHistory(history.id)">
                    {{ t.common.detail }}
                  </AppButton>
                </article>
              </div>
            </template>
          </section>

          <section v-else class="api-case-management__drawer-panel" data-testid="api-case-change-history">
            <div v-if="!changeHistory.length" class="api-case-management__empty">
              {{ t.apiAutomation.caseChangeHistoryEmpty }}
            </div>
            <div v-else class="api-case-management__change-timeline">
              <article v-for="history in changeHistory" :key="history.id" data-testid="api-case-change-history-row">
                <span></span>
                <div>
                  <strong>{{ history.changeType || '-' }}</strong>
                  <p>{{ history.summary || '-' }}</p>
                  <small>{{ history.changedBy || '-' }} / {{ history.createdAt || '-' }}</small>
                </div>
              </article>
            </div>
          </section>
        </div>
      </a-spin>
    </AppDrawer>

    <ApiCaseDialog
      ref="caseDialogRef"
      :mode="dialogMode"
      :case-id="editingCaseId"
      :definition-id="definitionId"
      @success="loadCases"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

import { ApiCaseDeleteButton } from '@features/api-case-delete';
import { ApiCaseRunButton } from '@features/api-case-run';
import { ApiCaseDialog } from '@features/api-case-save';
import { t } from '@shared/i18n';
import { AppButton, AppDrawer, AppLoadingState } from '@shared/ui';
import { ApiRunResultPanel } from '@widgets/api-run-result-panel';

import { useApiCaseManagement } from '../model/useApiCaseManagement';

const props = defineProps<{
  definitionId?: number | null;
  selectedDefinitionName?: string;
  environmentId?: number | null;
  variableSetId?: number | null;
}>();

const {
  loading,
  detailLoading,
  errorMessage,
  cases,
  selectedCase,
  selectedCaseDetail,
  runHistory,
  selectedRunHistoryDetail,
  changeHistory,
  runResult,
  loadCases,
  selectCase,
  selectRunHistory,
  backToRunHistoryList,
  setRunResult
} = useApiCaseManagement(() => props.definitionId || null);

const detailVisible = ref(false);
const activeDrawerTab = ref<'detail' | 'runHistory' | 'changeHistory'>('detail');
const dialogMode = ref<'create' | 'edit'>('create');
const editingCaseId = ref<number | null>(null);
const caseDialogRef = ref<{
  openCreate: () => void;
  openEdit: () => void | Promise<void>;
} | null>(null);
const historyDetailRunResult = computed(() => {
  if (!selectedRunHistoryDetail.value) {
    return null;
  }

  return {
    taskId: selectedRunHistoryDetail.value.taskId || 0,
    reportId: selectedRunHistoryDetail.value.reportId || 0,
    taskName: selectedCaseDetail.value?.name || selectedCase.value?.name || t.apiAutomation.caseRunHistory,
    reportName: selectedCaseDetail.value?.name || selectedCase.value?.name || t.apiAutomation.caseRunHistory,
    result: selectedRunHistoryDetail.value.result || '-',
    failureSummary: selectedRunHistoryDetail.value.failureSummary || null,
    stepResults: selectedRunHistoryDetail.value.stepResults || []
  };
});

async function openCreateDialog() {
  dialogMode.value = 'create';
  editingCaseId.value = null;
  await nextTick();
  caseDialogRef.value?.openCreate();
}

async function openEditDialog(id: number) {
  dialogMode.value = 'edit';
  editingCaseId.value = id;
  await nextTick();
  await caseDialogRef.value?.openEdit();
}

watch(selectedCase, (value) => {
  detailVisible.value = !!value;
  activeDrawerTab.value = 'detail';
});

function resultToneClass(result?: string | null) {
  const normalized = String(result || '').toLowerCase();

  if (normalized.includes('pass') || normalized.includes('success')) {
    return 'is-success';
  }

  if (normalized.includes('fail') || normalized.includes('error')) {
    return 'is-failed';
  }

  return 'is-muted';
}
</script>

<style scoped>
.api-case-management,
.api-case-management__drawer,
.api-case-management__history-table {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.api-case-management__drawer {
  gap: 0;
  min-height: 0;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: var(--app-color-surface);
  overflow: hidden;
}

.api-case-management__drawer-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.85fr);
  gap: 16px;
  align-items: center;
  border-bottom: 1px solid var(--app-color-border);
  padding: 14px 16px;
}

.api-case-management__drawer-heading {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.api-case-management__drawer-heading strong {
  overflow: hidden;
  color: var(--app-color-text);
  font-size: 16px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-case-management__drawer-heading small,
.api-case-management__summary-path {
  color: var(--app-color-text-muted);
}

.api-case-management__drawer-summary {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  min-width: 0;
}

.api-case-management__method {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  height: 28px;
  border: 1px solid currentColor;
  border-radius: var(--app-radius-sm);
  color: rgb(var(--primary-6));
  font-size: 13px;
  font-weight: 650;
}

.api-case-management__summary-path {
  overflow: hidden;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-case-management__view-tabs {
  display: flex;
  align-items: center;
  gap: 0;
  min-height: 40px;
  border-bottom: 1px solid var(--app-color-border);
  padding: 0 14px;
}

.api-case-management__view-tabs button {
  height: 40px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--app-color-text-muted);
  cursor: pointer;
  font-size: 13px;
  padding: 0 12px;
}

.api-case-management__view-tabs button.active {
  border-bottom-color: rgb(var(--primary-6));
  color: rgb(var(--primary-6));
  font-weight: 600;
}

.api-case-management__drawer-panel {
  display: grid;
  gap: 12px;
  min-width: 0;
  padding: 12px 16px 16px;
}

.api-case-management__meta {
  overflow: hidden;
  border-radius: var(--app-radius-sm);
}

.api-case-management__drawer-title {
  border-bottom: 1px solid var(--app-color-border);
  padding-bottom: 6px;
}

.api-case-management__header,
.api-case-management__row,
.api-case-management__actions,
.api-case-management__row-actions {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--app-spacing-sm);
  min-width: 0;
}

.api-case-management__actions,
.api-case-management__row-actions {
  flex-wrap: wrap;
  justify-content: flex-end;
}

.api-case-management__header h3,
.api-case-management__header p,
.api-case-management__drawer h4 {
  margin: 0;
}

.api-case-management__header h3,
.api-case-management__drawer h4 {
  color: var(--app-color-text);
  font-size: 15px;
  font-weight: 650;
}

.api-case-management__header p,
.api-case-management__empty,
.api-case-management__row-main small,
.api-case-management__history small {
  color: var(--app-color-text-muted);
}

.api-case-management__density-shell {
  min-width: 0;
  overflow: hidden;
}

.api-case-management__list {
  display: grid;
  gap: 0;
  min-width: 820px;
  overflow: hidden;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
}

.api-case-management__list-head,
.api-case-management__row {
  display: grid;
  grid-template-columns: 64px minmax(180px, 1fr) 76px 86px 86px minmax(180px, 1fr) 170px;
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.api-case-management__list-head {
  background: #f8fafc;
  color: var(--app-color-text-muted);
  font-size: 12px;
  font-weight: 600;
  min-height: 42px;
  padding: 0 10px;
}

.api-case-management__row,
.api-case-management__history-row {
  background: var(--app-color-surface);
  padding: 0 10px;
}

.api-case-management__row {
  border-top: 1px solid var(--app-color-border);
  min-height: 46px;
}

.api-case-management__row:hover {
  background: #fbfdff;
}

.api-case-management__row-main {
  display: grid;
  gap: 4px;
  min-width: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
}

.api-case-management__row-main strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-case-management__path {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-case-management__pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 42px;
  border: 1px solid var(--app-color-border);
  border-top: 0;
  border-radius: 0 0 var(--app-radius-sm) var(--app-radius-sm);
  color: var(--app-color-text-muted);
  font-size: 12px;
  padding: 0 10px;
}

.api-case-management__history-table {
  gap: 0;
  overflow: hidden;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
}

.api-case-management__history-head,
.api-case-management__history-row {
  display: grid;
  grid-template-columns: minmax(170px, 1fr) 90px 90px 88px;
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.api-case-management__history-head {
  min-height: 40px;
  background: #f8fafc;
  color: var(--app-color-text-muted);
  font-size: 12px;
  font-weight: 600;
  padding: 0 10px;
}

.api-case-management__history-row {
  min-height: 42px;
  border-top: 1px solid var(--app-color-border);
  font-size: 13px;
}

.api-case-management__history-row strong.is-success,
.api-case-management__history-metrics span:first-child {
  color: #039855;
}

.api-case-management__history-row strong.is-failed {
  color: #d92d20;
}

.api-case-management__history-row strong.is-muted {
  color: var(--app-color-text-muted);
}

.api-case-management__history-detail {
  display: grid;
  gap: 10px;
}

.api-case-management__history-detail-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

.api-case-management__history-metrics {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  min-width: 0;
  color: var(--app-color-text-muted);
  font-size: 12px;
}

.api-case-management__change-timeline {
  display: grid;
  gap: 0;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  overflow: hidden;
}

.api-case-management__change-timeline article {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  gap: 10px;
  border-bottom: 1px solid var(--app-color-border);
  background: var(--app-color-surface);
  padding: 10px 12px;
}

.api-case-management__change-timeline article:last-child {
  border-bottom: 0;
}

.api-case-management__change-timeline article > span {
  width: 8px;
  height: 8px;
  margin-top: 6px;
  border-radius: 999px;
  background: rgb(var(--primary-6));
}

.api-case-management__change-timeline strong,
.api-case-management__change-timeline p,
.api-case-management__change-timeline small {
  margin: 0;
}

.api-case-management__change-timeline p,
.api-case-management__change-timeline small {
  color: var(--app-color-text-muted);
  font-size: 12px;
}

@media (max-width: 720px) {
  .api-case-management__header,
  .api-case-management__row {
    align-items: start;
  }

  .api-case-management__drawer-head,
  .api-case-management__history-head,
  .api-case-management__history-row {
    grid-template-columns: 1fr;
  }

  .api-case-management__drawer-summary,
  .api-case-management__history-detail-head,
  .api-case-management__history-metrics {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
