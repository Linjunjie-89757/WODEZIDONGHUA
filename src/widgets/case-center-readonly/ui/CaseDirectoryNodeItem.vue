<template>
  <div class="case-directory-node">
    <div class="case-directory-node__label">
      <span class="case-directory-node__label-text" :title="node.name">{{ node.name }}</span>
      <span class="case-directory-node__actions">
        <CaseDirectoryCreateDialog
          :parent-id="node.id"
          :workspace-code="node.workspaceCode"
          :button-text="t.caseCenter.directoryCreateChild"
          @success="emit('success')"
        />
        <CaseDirectoryRenameDialog :node="node" @success="emit('success')" />
        <CaseDirectoryMoveToRootButton :node="node" @success="emit('success')" />
        <CaseDirectoryDeleteButton :node="node" @success="emit('success')" />
      </span>
    </div>
    <div v-if="node.children.length" class="case-directory-node__children">
      <CaseDirectoryNodeItem
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        @success="emit('success')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CaseDirectoryNode } from '@entities/case-center';
import { t } from '@shared/i18n';
import { CaseDirectoryCreateDialog } from '@features/case-directory-create';
import { CaseDirectoryDeleteButton } from '@features/case-directory-delete';
import { CaseDirectoryMoveToRootButton } from '@features/case-directory-move';
import { CaseDirectoryRenameDialog } from '@features/case-directory-rename';

defineProps<{
  node: CaseDirectoryNode;
}>();

const emit = defineEmits<{
  success: [];
}>();
</script>

<style scoped>
.case-directory-node {
  min-width: 0;
}

.case-directory-node__label {
  display: grid;
  gap: var(--app-spacing-xs);
  min-width: 0;
  padding: 6px 8px;
  border-radius: 6px;
  background: var(--app-color-bg-muted);
  color: var(--app-color-text);
  font-size: 13px;
}

.case-directory-node__label-text {
  display: block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.case-directory-node__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 2px;
}

.case-directory-node__children {
  display: grid;
  gap: 4px;
  margin-top: 4px;
  padding-left: 14px;
}
</style>
