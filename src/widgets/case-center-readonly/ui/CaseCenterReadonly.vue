<template>
  <AppSection :title="t.caseCenter.overviewTitle" :description="t.caseCenter.overviewDescription">
    <template #actions>
      <AppButton type="text" :loading="loading" @click="loadReadonly">
        {{ t.caseCenter.retry }}
      </AppButton>
    </template>

    <a-grid :cols="{ xs: 1, sm: 4 }" :col-gap="12" :row-gap="12">
      <a-grid-item>
        <a-statistic :title="t.caseCenter.caseTotal" :value="summary.caseTotal" />
      </a-grid-item>
      <a-grid-item>
        <a-statistic :title="t.caseCenter.directoryTotal" :value="summary.directoryTotal" />
      </a-grid-item>
      <a-grid-item>
        <a-statistic :title="t.caseCenter.reviewedTotal" :value="summary.reviewedTotal" />
      </a-grid-item>
      <a-grid-item>
        <a-statistic :title="t.caseCenter.executedTotal" :value="summary.executedTotal" />
      </a-grid-item>
    </a-grid>

    <AppLoadingState v-if="loading" />
    <a-alert v-else-if="errorMessage" type="error" show-icon>
      <template #title>{{ errorMessage }}</template>
      <AppButton type="text" @click="loadReadonly">{{ t.common.retry }}</AppButton>
    </a-alert>
    <div v-else class="case-center-readonly__grid">
      <AppCard class="case-center-readonly__directory">
        <section class="case-center-readonly__panel">
          <header class="case-center-readonly__panel-header">
            <h3 class="case-center-readonly__panel-title">{{ t.caseCenter.directorySection }}</h3>
            <CaseDirectoryCreateDialog
              :button-text="t.caseCenter.directoryCreate"
              button-type="primary"
              @success="loadReadonly"
            />
          </header>
          <CaseDirectoryTree :directories="directories" @success="loadReadonly" />
        </section>
      </AppCard>

      <AppCard class="case-center-readonly__cases">
        <section class="case-center-readonly__panel">
          <header class="case-center-readonly__panel-header">
            <h3 class="case-center-readonly__panel-title">{{ t.caseCenter.caseListSection }}</h3>
            <CaseCreateDialog @success="loadReadonly" />
          </header>
          <CaseReadonlyList :cases="cases" @success="loadReadonly" />
        </section>
      </AppCard>
    </div>
  </AppSection>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { AppButton, AppCard, AppLoadingState, AppSection } from '@shared/ui';
import { CaseCreateDialog } from '@features/case-create';
import { CaseDirectoryCreateDialog } from '@features/case-directory-create';

import { useCaseCenterReadonly } from '../model/useCaseCenterReadonly';
import CaseDirectoryTree from './CaseDirectoryTree.vue';
import CaseReadonlyList from './CaseReadonlyList.vue';

const { loading, errorMessage, cases, directories, summary, loadReadonly } =
  useCaseCenterReadonly();
</script>

<style scoped>
.case-center-readonly__grid {
  display: grid;
  grid-template-columns: minmax(240px, 320px) minmax(0, 1fr);
  gap: var(--app-spacing-md);
  min-width: 0;
}

.case-center-readonly__directory,
.case-center-readonly__cases {
  min-width: 0;
}

.case-center-readonly__panel {
  display: grid;
  gap: var(--app-spacing-md);
  min-width: 0;
}

.case-center-readonly__panel-title {
  margin: 0;
  color: var(--app-color-text);
  font-size: 15px;
  font-weight: 650;
  line-height: 1.4;
}

.case-center-readonly__panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-spacing-sm);
  min-width: 0;
}

@media (max-width: 1024px) {
  .case-center-readonly__grid {
    grid-template-columns: 1fr;
  }
}
</style>
