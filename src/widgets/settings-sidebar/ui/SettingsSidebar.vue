<template>
  <aside class="settings-sidebar">
    <div class="settings-sidebar__title">{{ t.navigation.systemSettings }}</div>
    <a-menu :selected-keys="['ai-connections']">
      <a-menu-item v-for="item in settingsMenu" :key="item.key">{{ item.label }}</a-menu-item>
    </a-menu>
  </aside>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';

import { settingsMenu } from '../model/settingsMenu';
</script>

<style scoped>
.settings-sidebar {
  width: 220px;
  min-width: 220px;
  overflow: hidden;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-lg);
  background: var(--app-color-surface);
}

.settings-sidebar__title {
  padding: var(--app-spacing-md) var(--app-spacing-lg);
  border-bottom: 1px solid var(--app-color-border);
  font-weight: 650;
}
</style>
