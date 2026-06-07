<template>
  <section class="system-settings-page">
    <SettingsSidebar v-model:active-key="activeKey" />
    <main class="system-settings-page__content">
      <AiConnectionPool v-if="activeKey === 'ai-connections'" />
      <WorkspaceManagementPanel v-else />
    </main>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { AiConnectionPool } from '@widgets/ai-connection-pool';
import { SettingsSidebar } from '@widgets/settings-sidebar';
import { WorkspaceManagementPanel } from '@widgets/workspace-management-panel';

const activeKey = ref('ai-connections');
</script>

<style scoped>
.system-settings-page {
  display: flex;
  width: 100%;
  min-width: 0;
  min-height: calc(100vh - 56px);
  overflow: hidden;
  background: #f5f6f8;
}

.system-settings-page__content {
  flex: 1;
  min-width: 0;
  overflow: auto;
  padding: 28px 32px;
}

@media (max-width: 820px) {
  .system-settings-page {
    flex-direction: column;
  }

  .system-settings-page :deep(.settings-sidebar) {
    width: 100%;
    min-width: 0;
    border-right: 0;
    border-bottom: 1px solid #e5e7eb;
  }

  .system-settings-page__content {
    padding: 20px 16px;
  }
}
</style>
