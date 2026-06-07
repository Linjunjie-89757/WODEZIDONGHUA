<template>
  <AppButton
    type="text"
    status="danger"
    :loading="deletingId === attachment.id"
    @click="confirmDelete(bug, attachment, () => emit('success'))"
  >
    {{ t.common.delete }}
  </AppButton>
</template>

<script setup lang="ts">
import type { BugAttachment, BugDetail } from '@entities/bug';
import { t } from '@shared/i18n';
import { AppButton } from '@shared/ui';

import { useBugAttachmentDelete } from '../model/useBugAttachmentDelete';

defineProps<{
  bug: BugDetail;
  attachment: BugAttachment;
}>();

const emit = defineEmits<{
  success: [];
}>();

const { deletingId, confirmDelete } = useBugAttachmentDelete();
</script>
