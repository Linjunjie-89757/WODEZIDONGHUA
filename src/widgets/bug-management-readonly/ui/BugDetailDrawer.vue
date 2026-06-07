<template>
  <AppDrawer :visible="visible" :title="title" width="680px" @update:visible="emit('close')">
    <AppLoadingState v-if="loading" />
    <a-alert v-else-if="errorMessage" type="error" show-icon>
      <template #title>{{ errorMessage }}</template>
    </a-alert>
    <div v-else-if="bug" class="bug-detail-drawer">
      <section class="bug-detail-drawer__section">
        <div class="bug-detail-drawer__actions">
          <BugTransitionDialog :bug="bug" @success="emit('success')" />
          <BugCommentAddDialog :bug="bug" @success="emit('success')" />
        </div>
        <div class="bug-detail-drawer__badges">
          <AppStatusBadge :label="bug.priority" color="blue" />
          <AppStatusBadge :label="bug.severity" color="orange" />
          <AppStatusBadge :label="bug.status" color="green" />
          <AppStatusBadge :label="bug.sourceType" color="gray" />
        </div>
        <p class="bug-detail-drawer__description">{{ bug.description || t.common.empty }}</p>
      </section>

      <section class="bug-detail-drawer__section">
        <h3>{{ t.bugManagement.basicInfo }}</h3>
        <dl class="bug-detail-drawer__meta">
          <div>
            <dt>{{ t.bugManagement.fieldAssignee }}</dt>
            <dd>{{ bug.assigneeName || '-' }}</dd>
          </div>
          <div>
            <dt>{{ t.bugManagement.fieldReporter }}</dt>
            <dd>{{ bug.reporterName || '-' }}</dd>
          </div>
          <div>
            <dt>{{ t.bugManagement.fieldWorkspace }}</dt>
            <dd>{{ bug.workspaceName || bug.workspaceCode }}</dd>
          </div>
          <div>
            <dt>{{ t.bugManagement.fieldUpdatedAt }}</dt>
            <dd>{{ bug.updatedAt || bug.createdAt || '-' }}</dd>
          </div>
        </dl>
      </section>

      <section class="bug-detail-drawer__section">
        <h3>{{ t.bugManagement.tags }}</h3>
        <div class="bug-detail-drawer__tags">
          <AppStatusBadge
            v-for="tag in bug.tags"
            :key="tag"
            :label="tag"
            color="gray"
          />
          <span v-if="!bug.tags.length" class="bug-detail-drawer__muted">{{ t.common.empty }}</span>
        </div>
      </section>

      <section class="bug-detail-drawer__section">
        <header class="bug-detail-drawer__section-header">
          <h3>{{ t.bugManagement.attachments }}</h3>
          <BugAttachmentUploadButton :bug="bug" @success="emit('success')" />
        </header>
        <ul v-if="bug.attachments.length" class="bug-detail-drawer__list">
          <li v-for="attachment in bug.attachments" :key="attachment.id">
            <span>{{ attachment.fileName }}</span>
            <span class="bug-detail-drawer__row-actions">
              <BugAttachmentDownloadButton :bug="bug" :attachment="attachment" />
              <BugAttachmentDeleteButton
                :bug="bug"
                :attachment="attachment"
                @success="emit('success')"
              />
            </span>
          </li>
        </ul>
        <p v-else class="bug-detail-drawer__muted">{{ t.common.empty }}</p>
      </section>

      <section class="bug-detail-drawer__section">
        <h3>{{ t.bugManagement.activities }}</h3>
        <ul v-if="bug.activities.length" class="bug-detail-drawer__list">
          <li v-for="activity in bug.activities.slice(0, 6)" :key="activity.id">
            <span>
              <span>{{ activity.title }}</span>
              <span v-if="activity.content" class="bug-detail-drawer__content">
                {{ activity.content }}
              </span>
            </span>
            <span class="bug-detail-drawer__muted">{{ activity.operatorName || '-' }}</span>
          </li>
        </ul>
        <p v-else class="bug-detail-drawer__muted">{{ t.common.empty }}</p>
      </section>

      <section class="bug-detail-drawer__section">
        <h3>{{ t.bugManagement.comments }}</h3>
        <ul v-if="bug.comments.length" class="bug-detail-drawer__list">
          <li v-for="comment in bug.comments.slice(0, 5)" :key="comment.id">
            <span>{{ comment.content }}</span>
            <span class="bug-detail-drawer__muted">{{ comment.commenterName }}</span>
          </li>
        </ul>
        <p v-else class="bug-detail-drawer__muted">{{ t.common.empty }}</p>
      </section>
    </div>
  </AppDrawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { BugDetail } from '@entities/bug';
import { t } from '@shared/i18n';
import { AppDrawer, AppLoadingState, AppStatusBadge } from '@shared/ui';
import { BugAttachmentDeleteButton } from '@features/bug-attachment-delete';
import { BugAttachmentDownloadButton } from '@features/bug-attachment-download';
import { BugAttachmentUploadButton } from '@features/bug-attachment-upload';
import { BugCommentAddDialog } from '@features/bug-comment-add';
import { BugTransitionDialog } from '@features/bug-transition';

const props = defineProps<{
  visible: boolean;
  loading: boolean;
  errorMessage: string;
  bug: BugDetail | null;
}>();

const emit = defineEmits<{
  close: [];
  success: [];
}>();

const title = computed(() => props.bug?.title || t.bugManagement.detailTitle);
</script>

<style scoped>
.bug-detail-drawer {
  display: grid;
  gap: var(--app-spacing-lg);
}

.bug-detail-drawer__section {
  display: grid;
  gap: var(--app-spacing-sm);
  min-width: 0;
}

.bug-detail-drawer__section h3 {
  margin: 0;
  color: var(--app-color-text);
  font-size: 15px;
  font-weight: 650;
  line-height: 1.4;
}

.bug-detail-drawer__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-spacing-sm);
  min-width: 0;
}

.bug-detail-drawer__badges,
.bug-detail-drawer__actions,
.bug-detail-drawer__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.bug-detail-drawer__actions {
  justify-content: flex-end;
}

.bug-detail-drawer__description {
  margin: 0;
  color: var(--app-color-text);
  line-height: 1.7;
  white-space: pre-wrap;
}

.bug-detail-drawer__meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
}

.bug-detail-drawer__meta div {
  min-width: 0;
}

.bug-detail-drawer__meta dt {
  color: var(--app-color-text-secondary);
  font-size: 12px;
}

.bug-detail-drawer__meta dd {
  margin: 4px 0 0;
  overflow: hidden;
  color: var(--app-color-text);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bug-detail-drawer__list {
  display: grid;
  gap: 8px;
  min-width: 0;
  padding: 0;
  margin: 0;
  list-style: none;
}

.bug-detail-drawer__list li {
  display: flex;
  justify-content: space-between;
  gap: var(--app-spacing-sm);
  align-items: center;
  min-width: 0;
  color: var(--app-color-text);
}

.bug-detail-drawer__list li > span:first-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bug-detail-drawer__content {
  display: block;
  margin-top: 2px;
  overflow: hidden;
  color: var(--app-color-text-secondary);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bug-detail-drawer__row-actions {
  display: flex;
  flex: 0 0 auto;
  gap: 4px;
}

.bug-detail-drawer__muted {
  color: var(--app-color-text-secondary);
}

@media (max-width: 640px) {
  .bug-detail-drawer__meta {
    grid-template-columns: 1fr;
  }

  .bug-detail-drawer__list li {
    display: grid;
  }
}
</style>
