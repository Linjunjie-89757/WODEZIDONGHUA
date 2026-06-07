<template>
  <div class="api-definition-modules" data-testid="api-definition-modules">
    <AppEmptyState v-if="!modules.length" :title="t.apiAutomation.emptyModules" />
    <ul v-else class="api-definition-modules__list">
      <ApiDefinitionModuleNode v-for="module in modules" :key="module.id" :module="module" />
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { ApiDefinitionModuleItem } from '@entities/api-automation';
import { t } from '@shared/i18n';
import { AppEmptyState } from '@shared/ui';

import ApiDefinitionModuleNode from './ApiDefinitionModuleNode.vue';

defineProps<{
  modules: ApiDefinitionModuleItem[];
}>();
</script>

<style scoped>
.api-definition-modules {
  min-width: 0;
}

.api-definition-modules__list {
  display: grid;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
