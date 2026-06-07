<template>
  <AppButton type="text" :loading="downloadingId === attachment.id" @click="download(bug, attachment)">
    {{ t.bugManagement.attachmentDownload }}
  </AppButton>
</template>

<script setup lang="ts">
import type { BugAttachment, BugDetail } from '@entities/bug';
import { t } from '@shared/i18n';
import { AppButton } from '@shared/ui';

import { useBugAttachmentDownload } from '../model/useBugAttachmentDownload';

defineProps<{
  bug: BugDetail;
  attachment: BugAttachment;
}>();

const { downloadingId, download } = useBugAttachmentDownload();
</script>
