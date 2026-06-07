<template>
  <AppButton type="text" :loading="uploading" @click="triggerFileInput">
    {{ t.bugManagement.attachmentUpload }}
  </AppButton>
  <input
    ref="fileInputRef"
    class="bug-attachment-upload__input"
    type="file"
    multiple
    @change="handleFileChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { BugDetail } from '@entities/bug';
import { t } from '@shared/i18n';
import { AppButton } from '@shared/ui';

import { useBugAttachmentUpload } from '../model/useBugAttachmentUpload';

const props = defineProps<{
  bug: BugDetail;
}>();

const emit = defineEmits<{
  success: [];
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const { uploading, upload } = useBugAttachmentUpload();

function triggerFileInput() {
  fileInputRef.value?.click();
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files || []);
  const succeed = await upload(props.bug, files);
  input.value = '';

  if (succeed) {
    emit('success');
  }
}
</script>

<style scoped>
.bug-attachment-upload__input {
  display: none;
}
</style>
