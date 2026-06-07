<template>
  <section class="case-center-readonly">
    <div class="case-center-readonly__tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        :class="['case-center-readonly__tab', { 'is-active': tab.key === activeTab }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <template v-if="activeTab === 'manage'">
      <aside class="case-center-readonly__rail">
        <div class="case-center-readonly__rail-search">
          <span></span>
          <input :placeholder="t.caseCenter.directorySearchPlaceholder" />
        </div>
        <div class="case-center-readonly__rail-head">
          <strong>{{ t.caseCenter.caseCategory }}</strong>
          <small>{{ directories.length }}</small>
        </div>
        <CaseDirectoryTree :directories="directories" @success="loadReadonly" />
      </aside>

      <main class="case-center-readonly__main">
        <section class="case-center-readonly__stats">
          <article v-for="stat in statCards" :key="stat.label" :class="`is-${stat.tone}`">
            <span>{{ stat.label }}</span>
            <strong>{{ stat.value }}</strong>
            <small>{{ stat.hint }}</small>
          </article>
        </section>

        <AppLoadingState v-if="loading" class="case-center-readonly__state" />
        <a-alert v-else-if="errorMessage" type="error" show-icon class="case-center-readonly__state">
          <template #title>{{ errorMessage }}</template>
          <AppButton type="text" @click="loadReadonly">{{ t.common.retry }}</AppButton>
        </a-alert>
        <section v-else class="case-center-readonly__table-shell">
          <header class="case-center-readonly__toolbar">
            <div class="case-center-readonly__filters">
              <label class="case-center-readonly__search">
                <span></span>
                <input :placeholder="t.caseCenter.caseSearchPlaceholder" />
              </label>
              <select :aria-label="t.caseCenter.fieldPriority">
                <option>{{ t.caseCenter.fieldPriority }}</option>
              </select>
              <select :aria-label="t.caseCenter.fieldStatus">
                <option>{{ t.caseCenter.fieldStatus }}</option>
              </select>
              <select :aria-label="t.caseCenter.fieldExecutionStatus">
                <option>{{ t.caseCenter.fieldExecutionStatus }}</option>
              </select>
              <select :aria-label="t.caseCenter.fieldOwner">
                <option>{{ t.caseCenter.fieldOwner }}</option>
              </select>
            </div>
            <div class="case-center-readonly__toolbar-actions">
              <AppButton type="text" :loading="loading" @click="loadReadonly">
                {{ t.caseCenter.retry }}
              </AppButton>
              <CaseCreateDialog @success="loadReadonly" />
            </div>
          </header>

          <CaseReadonlyList :cases="cases" @success="loadReadonly" />

          <footer class="case-center-readonly__pagination">
            <span>{{ t.caseCenter.caseListTotal.replace('{count}', String(summary.caseTotal)) }}</span>
            <div>
              <button type="button">{{ t.caseCenter.previousPage }}</button>
              <button type="button" class="is-active">1</button>
              <button type="button">{{ t.caseCenter.nextPage }}</button>
            </div>
          </footer>
        </section>
      </main>
    </template>

    <section v-else class="case-center-readonly__coming-soon">
      <strong>{{ activeTabLabel }}</strong>
      <p>{{ t.caseCenter.aiTabContractHint }}</p>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { t } from '@shared/i18n';
import { AppButton, AppLoadingState } from '@shared/ui';
import { CaseCreateDialog } from '@features/case-create';

import { useCaseCenterReadonly } from '../model/useCaseCenterReadonly';
import CaseDirectoryTree from './CaseDirectoryTree.vue';
import CaseReadonlyList from './CaseReadonlyList.vue';

const { loading, errorMessage, cases, directories, summary, loadReadonly } =
  useCaseCenterReadonly();

const tabs = [
  { key: 'manage', label: t.caseCenter.tabManage },
  { key: 'ai-generate', label: t.caseCenter.tabAiGenerate },
  { key: 'ai-history', label: t.caseCenter.tabAiHistory },
  { key: 'ai-config', label: t.caseCenter.tabAiConfig }
] as const;

type CaseCenterTab = (typeof tabs)[number]['key'];

const activeTab = ref<CaseCenterTab>('manage');

const statCards = computed(() => [
  {
    label: t.caseCenter.caseTotal,
    value: summary.value.caseTotal,
    hint: t.caseCenter.caseTotalHint,
    tone: 'blue'
  },
  {
    label: t.caseCenter.directoryTotal,
    value: summary.value.directoryTotal,
    hint: t.caseCenter.directoryTotalHint,
    tone: 'purple'
  },
  {
    label: t.caseCenter.reviewedTotal,
    value: summary.value.reviewedTotal,
    hint: t.caseCenter.reviewedTotalHint,
    tone: 'green'
  },
  {
    label: t.caseCenter.executedTotal,
    value: summary.value.executedTotal,
    hint: t.caseCenter.executedTotalHint,
    tone: 'orange'
  }
]);

const activeTabLabel = computed(
  () => tabs.find((tab) => tab.key === activeTab.value)?.label || t.caseCenter.tabManage
);
</script>

<style scoped>
.case-center-readonly {
  display: grid;
  grid-template-columns: 256px minmax(0, 1fr);
  grid-template-rows: 48px minmax(0, 1fr);
  width: 100%;
  min-width: 0;
  min-height: calc(100vh - 56px);
  background: #f5f6f8;
}

.case-center-readonly__tabs {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  height: 48px;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
  padding: 0 24px;
}

.case-center-readonly__tabs::before {
  content: "";
  position: absolute;
}

.case-center-readonly__tab {
  height: 32px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 0 16px;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease;
}

.case-center-readonly__tab:hover {
  color: #374151;
}

.case-center-readonly__tab.is-active {
  background: #ffffff;
  color: #111827;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
}

.case-center-readonly__tabs {
  gap: 2px;
}

.case-center-readonly__tabs > button:first-child {
  margin-left: 0;
}

.case-center-readonly__tabs {
  position: relative;
}

.case-center-readonly__tabs::after {
  content: "";
  position: absolute;
  left: 24px;
  top: 8px;
  z-index: 0;
  width: 454px;
  height: 32px;
  border-radius: 8px;
  background: #f3f4f6;
}

.case-center-readonly__tab {
  position: relative;
  z-index: 1;
}

.case-center-readonly__rail {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  border-right: 1px solid #e5e7eb;
  background: #ffffff;
}

.case-center-readonly__rail-search {
  position: relative;
  padding: 12px 12px 8px;
}

.case-center-readonly__rail-search span,
.case-center-readonly__search span {
  position: absolute;
  left: 24px;
  top: 50%;
  width: 14px;
  height: 14px;
  border: 1.6px solid #9ca3af;
  border-radius: 999px;
  transform: translateY(-50%);
}

.case-center-readonly__rail-search span::after,
.case-center-readonly__search span::after {
  content: "";
  position: absolute;
  right: -5px;
  bottom: -4px;
  width: 6px;
  height: 1.6px;
  border-radius: 999px;
  background: #9ca3af;
  transform: rotate(45deg);
}

.case-center-readonly__rail-search input,
.case-center-readonly__search input,
.case-center-readonly__filters select {
  height: 34px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  outline: none;
}

.case-center-readonly__rail-search input {
  width: 100%;
  padding: 0 12px 0 34px;
}

.case-center-readonly__rail-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 12px 6px;
  border-bottom: 1px solid #f3f4f6;
  padding: 6px 4px;
}

.case-center-readonly__rail-head strong {
  color: #374151;
  font-size: 14px;
  font-weight: 600;
}

.case-center-readonly__rail-head small {
  min-width: 22px;
  border-radius: 999px;
  background: #f3f4f6;
  color: #9ca3af;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
}

.case-center-readonly__main {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  overflow: auto;
  padding: 24px;
}

.case-center-readonly__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.case-center-readonly__stats article,
.case-center-readonly__table-shell,
.case-center-readonly__coming-soon {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.case-center-readonly__stats article {
  position: relative;
  min-width: 0;
  padding: 18px 20px;
}

.case-center-readonly__stats article::after {
  content: "";
  position: absolute;
  right: 18px;
  top: 22px;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: currentColor;
}

.case-center-readonly__stats span {
  display: block;
  color: #4b5563;
  font-size: 13px;
  line-height: 20px;
}

.case-center-readonly__stats strong {
  display: block;
  margin-top: 8px;
  color: #111827;
  font-size: 28px;
  font-weight: 700;
  line-height: 32px;
}

.case-center-readonly__stats small {
  display: block;
  margin-top: 8px;
  color: #6b7280;
  font-size: 12px;
  line-height: 18px;
}

.case-center-readonly__stats .is-blue {
  color: #3b82f6;
}

.case-center-readonly__stats .is-purple {
  color: #8b5cf6;
}

.case-center-readonly__stats .is-green {
  color: #22c55e;
}

.case-center-readonly__stats .is-orange {
  color: #f97316;
}

.case-center-readonly__table-shell {
  min-width: 0;
  overflow: hidden;
}

.case-center-readonly__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #e5e7eb;
  padding: 20px;
}

.case-center-readonly__filters {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 12px;
  min-width: 0;
}

.case-center-readonly__search {
  position: relative;
  width: 260px;
}

.case-center-readonly__search span {
  left: 12px;
}

.case-center-readonly__search input {
  width: 100%;
  padding: 0 12px 0 34px;
}

.case-center-readonly__filters select {
  min-width: 104px;
  cursor: pointer;
  padding: 0 28px 0 10px;
}

.case-center-readonly__toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.case-center-readonly__toolbar-actions :deep(.arco-btn) {
  height: 34px;
  border-radius: 8px;
}

.case-center-readonly__pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #e5e7eb;
  padding: 14px 20px;
}

.case-center-readonly__pagination span {
  color: #6b7280;
  font-size: 13px;
}

.case-center-readonly__pagination div {
  display: flex;
  gap: 8px;
}

.case-center-readonly__pagination button {
  min-width: 32px;
  height: 28px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #ffffff;
  color: #374151;
  cursor: pointer;
  font-size: 13px;
  padding: 0 10px;
}

.case-center-readonly__pagination button.is-active {
  border-color: #2563eb;
  background: #2563eb;
  color: #ffffff;
}

.case-center-readonly__state {
  margin: 0;
}

.case-center-readonly__coming-soon {
  grid-column: 1 / -1;
  margin: 24px;
  padding: 28px;
}

.case-center-readonly__coming-soon strong {
  color: #111827;
  font-size: 16px;
}

.case-center-readonly__coming-soon p {
  margin: 8px 0 0;
  color: #6b7280;
  font-size: 13px;
}

@media (max-width: 1024px) {
  .case-center-readonly {
    grid-template-columns: 1fr;
    grid-template-rows: 48px auto auto;
  }

  .case-center-readonly__rail {
    max-height: 280px;
    border-right: 0;
    border-bottom: 1px solid #e5e7eb;
  }

  .case-center-readonly__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .case-center-readonly__tabs {
    overflow-x: auto;
    padding: 0 12px;
  }

  .case-center-readonly__tabs::after {
    left: 12px;
    width: 454px;
  }

  .case-center-readonly__main {
    padding: 16px;
  }

  .case-center-readonly__stats {
    grid-template-columns: 1fr;
  }

  .case-center-readonly__toolbar {
    align-items: stretch;
    flex-direction: column;
    padding: 16px;
  }

  .case-center-readonly__search,
  .case-center-readonly__filters select {
    width: 100%;
  }

  .case-center-readonly__toolbar-actions {
    justify-content: space-between;
  }

  .case-center-readonly__pagination {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }
}
</style>
