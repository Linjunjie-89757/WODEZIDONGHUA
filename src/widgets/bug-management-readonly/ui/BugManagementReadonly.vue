<template>
  <AppSection :title="t.bugManagement.overviewTitle" :description="t.bugManagement.overviewDescription">
    <template #actions>
      <AppButton type="text" :loading="loading" @click="loadReadonly">
        {{ t.bugManagement.retry }}
      </AppButton>
    </template>

    <a-grid :cols="{ xs: 1, sm: 2, md: 5 }" :col-gap="12" :row-gap="12">
      <a-grid-item v-for="item in visibleStatistics" :key="item.label">
        <a-statistic :title="item.label" :value="item.value" />
      </a-grid-item>
    </a-grid>

    <AppLoadingState v-if="loading" />
    <a-alert v-else-if="errorMessage" type="error" show-icon>
      <template #title>{{ errorMessage }}</template>
      <AppButton type="text" @click="loadReadonly">{{ t.common.retry }}</AppButton>
    </a-alert>
    <AppCard v-else>
      <section class="bug-management-readonly__panel">
        <header class="bug-management-readonly__panel-header">
          <h3 class="bug-management-readonly__panel-title">{{ t.bugManagement.listSection }}</h3>
          <BugCreateDialog @success="loadReadonly" />
        </header>
        <BugReadonlyList :bugs="bugs" @select="openDetail" @success="loadReadonly" />
      </section>
    </AppCard>

    <BugDetailDrawer
      :visible="detailVisible"
      :loading="detailLoading"
      :error-message="detailErrorMessage"
      :bug="selectedBug"
      @close="closeDetail"
      @success="reloadSelectedDetail"
    />
  </AppSection>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { AppButton, AppCard, AppLoadingState, AppSection } from '@shared/ui';
import { BugCreateDialog } from '@features/bug-create';

import { useBugManagementReadonly } from '../model/useBugManagementReadonly';
import BugDetailDrawer from './BugDetailDrawer.vue';
import BugReadonlyList from './BugReadonlyList.vue';

const {
  loading,
  detailLoading,
  errorMessage,
  detailErrorMessage,
  bugs,
  selectedBug,
  detailVisible,
  visibleStatistics,
  loadReadonly,
  openDetail,
  reloadSelectedDetail,
  closeDetail
} = useBugManagementReadonly();
</script>

<style scoped>
.bug-management-readonly__panel {
  display: grid;
  gap: var(--app-spacing-md);
  min-width: 0;
}

.bug-management-readonly__panel-title {
  margin: 0;
  color: var(--app-color-text);
  font-size: 15px;
  font-weight: 650;
  line-height: 1.4;
}

.bug-management-readonly__panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-spacing-sm);
  min-width: 0;
}
</style>
