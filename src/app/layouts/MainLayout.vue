<template>
  <a-layout class="main-layout">
    <AppSidebar />
    <a-layout class="main-layout__main">
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
  background: #f5f6f8;
}

.main-layout__main {
  min-width: 0;
}

.main-layout__content {
  min-width: 0;
  min-height: calc(100vh - 56px);
  overflow: auto;
  background: #f5f6f8;
}
</style>
