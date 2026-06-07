<template>
  <a-layout-header class="app-header">
    <WorkspaceSwitcher />
    <div class="app-header__right">
      <span class="app-header__hint">{{ workspaceName }}</span>
      <LogoutButton />
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { LogoutButton } from '@features/auth-logout';
import { WorkspaceSwitcher } from '@features/workspace-switch';

import { useHeaderState } from '../model/useHeaderState';

const { workspaceName } = useHeaderState();
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 var(--app-spacing-xl);
  border-bottom: 1px solid var(--app-color-border);
  background: var(--app-color-surface);
}

.app-header__right {
  display: flex;
  align-items: center;
  gap: var(--app-spacing-md);
}

.app-header__hint {
  color: var(--app-color-text-muted);
}
</style>
