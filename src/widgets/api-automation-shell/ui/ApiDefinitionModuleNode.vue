<template>
  <li class="api-definition-module-node">
    <div class="api-definition-module-node__name">
      <span>{{ module.name }}</span>
      <small>{{ module.definitionCount || 0 }}</small>
    </div>
    <ul v-if="module.children?.length" class="api-definition-module-node__children">
      <ApiDefinitionModuleNode v-for="child in module.children" :key="child.id" :module="child" />
    </ul>
  </li>
</template>

<script setup lang="ts">
import type { ApiDefinitionModuleItem } from '@entities/api-automation';

defineProps<{
  module: ApiDefinitionModuleItem;
}>();
</script>

<style scoped>
.api-definition-module-node__children {
  display: grid;
  gap: 8px;
  list-style: none;
  margin: 8px 0 0;
  padding-left: var(--app-spacing-md);
}

.api-definition-module-node__name {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-spacing-sm);
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  padding: 8px 10px;
}

.api-definition-module-node__name small {
  color: var(--app-color-text-muted);
}
</style>
