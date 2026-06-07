<template>
  <AppPage :title="t.pages.configCenterTitle" :description="t.pages.configCenterDescription">
    <ConfigCenterOverview />
  </AppPage>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { AppPage } from '@shared/ui';
import { ConfigCenterOverview } from '@widgets/config-center-overview';
</script>
