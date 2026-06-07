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
          <span class="case-directory-tree__chevron"></span>
          <span class="case-directory-tree__folder"></span>
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
  gap: 2px;
  overflow-y: auto;
  padding: 0 8px 12px;
}

.case-directory-tree__workspace {
  display: grid;
  gap: 2px;
}

.case-directory-tree__workspace-name {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 34px;
  border-radius: 8px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  font-size: 13px;
  padding: 6px 6px 6px 8px;
}

.case-directory-tree__workspace-name:hover {
  background: #f3f4f6;
}

.case-directory-tree__chevron {
  width: 7px;
  height: 7px;
  border-right: 1.5px solid #9ca3af;
  border-bottom: 1.5px solid #9ca3af;
  transform: rotate(45deg);
}

.case-directory-tree__folder {
  position: relative;
  width: 15px;
  height: 12px;
  border-radius: 2px;
  background: #60a5fa;
}

.case-directory-tree__folder::before {
  content: "";
  position: absolute;
  left: 1px;
  top: -3px;
  width: 7px;
  height: 4px;
  border-radius: 2px 2px 0 0;
  background: #93c5fd;
}

.case-directory-tree__nodes {
  display: grid;
  gap: 2px;
}

.case-directory-tree__empty {
  color: #9ca3af;
  font-size: 12px;
  padding: 8px 0 8px 34px;
}
</style>
