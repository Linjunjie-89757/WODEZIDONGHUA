<template>
  <AppPage :title="t.pages.apiAutomationTitle" :description="t.pages.apiAutomationDescription">
    <ApiAutomationShell />
  </AppPage>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { AppPage } from '@shared/ui';
import { ApiAutomationShell } from '@widgets/api-automation-shell';
</script>
