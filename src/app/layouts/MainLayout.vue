<template>
  <a-layout class="main-layout">
    <AppSidebar />
    <a-layout>
      <AppHeader />
      <a-layout-content class="main-layout__content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { AppHeader } from '@widgets/app-header';
import { AppSidebar } from '@widgets/app-sidebar';
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  background: var(--app-color-bg);
}

.main-layout__content {
  min-width: 0;
  padding: var(--app-spacing-xl);
}
</style>
