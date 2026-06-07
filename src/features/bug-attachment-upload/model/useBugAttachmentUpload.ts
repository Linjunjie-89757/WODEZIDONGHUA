import { ref } from 'vue';

import { bugApi, type BugDetail } from '@entities/bug';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useBugAttachmentUpload() {
  const uploading = ref(false);

  async function upload(bug: BugDetail, files: File[]) {
    if (!files.length) {
      return false;
    }

    uploading.value = true;

    try {
      await bugApi.uploadAttachments(bug.id, files, bug.workspaceCode);
      feedback.success(t.bugManagement.attachmentUploadSuccess);
      return true;
    } catch {
      feedback.error(t.bugManagement.attachmentUploadFailed);
      return false;
    } finally {
      uploading.value = false;
    }
  }

  return {
    uploading,
    upload
  };
}
