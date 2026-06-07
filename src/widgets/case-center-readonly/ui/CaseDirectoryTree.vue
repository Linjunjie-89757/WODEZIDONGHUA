<template>
  <div class="case-directory-tree">
    <AppEmptyState v-if="!directories.length" :description="t.caseCenter.directoryEmpty" />
    <div v-else class="case-directory-tree__workspaces">
      <section
        v-for="workspace in directories"
        :key="workspace.workspaceCode"
        class="case-directory-tree__workspace"
      >
        <div class="case-directory-tree__workspace-name">
          {{ workspace.workspaceName || workspace.workspaceCode }}
        </div>
        <div v-if="workspace.children.length" class="case-directory-tree__nodes">
          <CaseDirectoryNodeItem
            v-for="node in workspace.children"
            :key="node.id"
            :node="node"
            @success="emit('success')"
          />
        </div>
        <div v-else class="case-directory-tree__empty">{{ t.caseCenter.workspaceRoot }}</div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CaseDirectoryWorkspace } from '@entities/case-center';
import { t } from '@shared/i18n';
import { AppEmptyState } from '@shared/ui';

import CaseDirectoryNodeItem from './CaseDirectoryNodeItem.vue';

defineProps<{
  directories: CaseDirectoryWorkspace[];
}>();

const emit = defineEmits<{
  success: [];
}>();
</script>

<style scoped>
.case-directory-tree__workspaces {
  display: grid;
  gap: var(--app-spacing-sm);
}

.case-directory-tree__workspace {
  display: grid;
  gap: var(--app-spacing-xs);
}

.case-directory-tree__workspace-name {
  font-weight: 600;
  color: var(--app-color-text);
}

.case-directory-tree__nodes {
  display: grid;
  gap: 4px;
}

.case-directory-tree__empty {
  color: var(--app-color-text-secondary);
  font-size: 13px;
}
</style>
