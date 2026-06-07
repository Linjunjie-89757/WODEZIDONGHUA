<template>
  <AppPage :title="t.pages.systemSettingsTitle" :description="t.pages.systemSettingsDescription">
    <div class="system-settings-page">
      <SettingsSidebar />
      <main class="system-settings-page__content">
        <AiConnectionPool />
      </main>
    </div>
  </AppPage>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { AppPage } from '@shared/ui';
import { AiConnectionPool } from '@widgets/ai-connection-pool';
import { SettingsSidebar } from '@widgets/settings-sidebar';
</script>

<style scoped>
.system-settings-page {
  display: flex;
  align-items: flex-start;
  gap: var(--app-spacing-lg);
  min-width: 0;
}

.system-settings-page__content {
  flex: 1;
  min-width: 0;
}

@media (max-width: 768px) {
  .system-settings-page {
    flex-direction: column;
  }
}
</style>
