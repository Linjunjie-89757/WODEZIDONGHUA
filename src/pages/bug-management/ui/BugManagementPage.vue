<template>
  <AppPage :title="t.pages.bugManagementTitle" :description="t.pages.bugManagementDescription">
    <BugManagementReadonly />
  </AppPage>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { AppPage } from '@shared/ui';
import { BugManagementReadonly } from '@widgets/bug-management-readonly';
</script>
