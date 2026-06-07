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
    <div v-else class="api-case-management__list" data-testid="api-case-list">
      <article
        v-for="item in cases"
        :key="item.id"
        class="api-case-management__row"
        data-testid="api-case-row"
      >
        <button type="button" class="api-case-management__row-main" @click="selectCase(item.id)">
          <strong>{{ item.name }}</strong>
          <small>{{ item.priority || '-' }} {{ t.apiAutomation.resultSeparator }} {{ item.status || '-' }}</small>
        </button>
        <div class="api-case-management__row-actions">
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

    <AppDrawer
      v-model:visible="detailVisible"
      :title="selectedCase?.name || t.apiAutomation.caseDetailTitle"
      width="720"
    >
      <a-spin :loading="detailLoading">
        <div class="api-case-management__drawer" data-testid="api-case-detail">
          <a-descriptions :column="1" bordered>
            <a-descriptions-item :label="t.apiAutomation.fieldMethod">
              {{ selectedCaseDetail?.requestConfig?.method || '-' }}
            </a-descriptions-item>
            <a-descriptions-item :label="t.apiAutomation.fieldPath">
              {{ selectedCaseDetail?.requestConfig?.path || '-' }}
            </a-descriptions-item>
            <a-descriptions-item :label="t.apiAutomation.fieldDescription">
              {{ selectedCaseDetail?.description || '-' }}
            </a-descriptions-item>
          </a-descriptions>

          <section>
            <h4>{{ t.apiAutomation.caseRunHistory }}</h4>
            <div v-if="!runHistory.length" class="api-case-management__empty">
              {{ t.apiAutomation.caseRunHistoryEmpty }}
            </div>
            <div v-else class="api-case-management__history" data-testid="api-case-run-history">
              <article v-for="history in runHistory" :key="history.id">
                <strong>{{ history.result || '-' }}</strong>
                <small>{{ history.createdAt || '-' }}</small>
              </article>
            </div>
          </section>

          <section>
            <h4>{{ t.apiAutomation.caseChangeHistory }}</h4>
            <div v-if="!changeHistory.length" class="api-case-management__empty">
              {{ t.apiAutomation.caseChangeHistoryEmpty }}
            </div>
            <div v-else class="api-case-management__history" data-testid="api-case-change-history">
              <article v-for="history in changeHistory" :key="history.id">
                <strong>{{ history.changeType || '-' }}</strong>
                <small>{{ history.summary || history.createdAt || '-' }}</small>
              </article>
            </div>
          </section>

          <section v-if="runResult" data-testid="api-case-run-result">
            <h4>{{ t.apiAutomation.caseRunResult }}</h4>
            <ApiRunResultPanel :result="runResult" />
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
import { nextTick, ref, watch } from 'vue';

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
  changeHistory,
  runResult,
  loadCases,
  selectCase,
  setRunResult
} = useApiCaseManagement(() => props.definitionId || null);

const detailVisible = ref(false);
const dialogMode = ref<'create' | 'edit'>('create');
const editingCaseId = ref<number | null>(null);
const caseDialogRef = ref<{
  openCreate: () => void;
  openEdit: () => void | Promise<void>;
} | null>(null);

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
});
</script>

<style scoped>
.api-case-management,
.api-case-management__drawer,
.api-case-management__history {
  display: grid;
  gap: var(--app-spacing-md);
  min-width: 0;
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

.api-case-management__list {
  display: grid;
  gap: var(--app-spacing-sm);
  min-width: 0;
}

.api-case-management__row,
.api-case-management__history article {
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: var(--app-color-surface);
  padding: var(--app-spacing-sm);
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

@media (max-width: 720px) {
  .api-case-management__header,
  .api-case-management__row {
    display: grid;
  }
}
</style>
