<template>
  <AppPage class="api-automation-page">
    <ApiAutomationShell />
  </AppPage>
</template>

<script setup lang="ts">
import { AppPage } from '@shared/ui';
import { ApiAutomationShell } from '@widgets/api-automation-shell';
</script>

<style scoped>
.api-automation-page {
  gap: 0;
}
</style>
