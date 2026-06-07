<template>
  <section class="case-center-page">
    <CaseCenterReadonly />
  </section>
</template>

<script setup lang="ts">
import { CaseCenterReadonly } from '@widgets/case-center-readonly';
</script>

<style scoped>
.case-center-page {
  display: flex;
  min-width: 0;
  min-height: calc(100vh - 56px);
  background: #f5f6f8;
}
</style>
