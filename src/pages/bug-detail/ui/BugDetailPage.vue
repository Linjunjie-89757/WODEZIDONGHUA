<template>
  <AppPage :title="t.pages.bugDetailTitle" :description="t.common.migrationPlaceholder" />
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { AppPage } from '@shared/ui';
</script>
