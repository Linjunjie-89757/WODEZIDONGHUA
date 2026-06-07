<template>
  <AppPage :title="t.pages.caseCenterTitle" :description="t.pages.caseCenterDescription">
    <CaseCenterReadonly />
  </AppPage>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { AppPage } from '@shared/ui';
import { CaseCenterReadonly } from '@widgets/case-center-readonly';
</script>
