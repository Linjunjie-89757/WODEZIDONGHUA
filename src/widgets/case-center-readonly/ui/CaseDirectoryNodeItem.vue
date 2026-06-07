<template>
  <div class="case-directory-node">
    <div class="case-directory-node__label">
      <span class="case-directory-node__chevron" :class="{ 'is-empty': !node.children.length }"></span>
      <span class="case-directory-node__folder"></span>
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
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  min-height: 32px;
  border-radius: 8px;
  background: transparent;
  color: #374151;
  cursor: pointer;
  font-size: 13px;
  padding: 6px 6px 6px 22px;
  transition: background 0.18s ease;
}

.case-directory-node__label:hover {
  background: #f3f4f6;
}

.case-directory-node__chevron {
  flex: 0 0 auto;
  width: 7px;
  height: 7px;
  border-right: 1.5px solid #9ca3af;
  border-bottom: 1.5px solid #9ca3af;
  transform: rotate(45deg);
}

.case-directory-node__chevron.is-empty {
  opacity: 0;
}

.case-directory-node__folder {
  position: relative;
  flex: 0 0 auto;
  width: 15px;
  height: 12px;
  border-radius: 2px;
  background: #d1d5db;
}

.case-directory-node__folder::before {
  content: "";
  position: absolute;
  left: 1px;
  top: -3px;
  width: 7px;
  height: 4px;
  border-radius: 2px 2px 0 0;
  background: #e5e7eb;
}

.case-directory-node__label-text {
  display: block;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.case-directory-node__actions {
  display: flex;
  flex: 0 0 auto;
  gap: 1px;
  opacity: 0;
  transition: opacity 0.18s ease;
}

.case-directory-node__label:hover .case-directory-node__actions {
  opacity: 1;
}

.case-directory-node__actions :deep(.arco-btn) {
  height: 22px;
  border-radius: 4px;
  font-size: 0;
  padding: 0 5px;
}

.case-directory-node__actions :deep(.arco-btn span) {
  font-size: 12px;
}

.case-directory-node__children {
  display: grid;
  gap: 2px;
}
</style>
