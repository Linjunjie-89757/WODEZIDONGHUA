<template>
  <AppPage class="api-automation-page">
    <template #title>
      <div class="api-automation-page__titlebar">
        <div>
          <h1>{{ t.pages.apiAutomationTitle }}</h1>
          <p>{{ t.pages.apiAutomationDescription }}</p>
        </div>
      </div>
    </template>
    <ApiAutomationShell />
  </AppPage>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { AppPage } from '@shared/ui';
import { ApiAutomationShell } from '@widgets/api-automation-shell';
</script>

<style scoped>
.api-automation-page {
  gap: 10px;
}

.api-automation-page__titlebar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--app-spacing-md);
  min-width: 0;
}

.api-automation-page__titlebar h1,
.api-automation-page__titlebar p {
  margin: 0;
}

.api-automation-page__titlebar h1 {
  color: var(--app-color-text);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.25;
}

.api-automation-page__titlebar p {
  margin-top: 4px;
  color: var(--app-color-text-muted);
  font-size: 13px;
}
</style>
