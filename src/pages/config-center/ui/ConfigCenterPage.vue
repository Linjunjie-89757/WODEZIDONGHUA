<template>
  <section class="config-center-page">
    <ConfigCenterOverview />
  </section>
</template>

<script setup lang="ts">
import { ConfigCenterOverview } from '@widgets/config-center-overview';
</script>

<style scoped>
.config-center-page {
  width: 100%;
  min-width: 0;
  min-height: calc(100vh - 56px);
  overflow: hidden;
  background: #f5f6f8;
}
</style>
