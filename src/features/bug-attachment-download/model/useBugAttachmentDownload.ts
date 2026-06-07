import { ref } from 'vue';

import { bugApi, type BugAttachment, type BugDetail } from '@entities/bug';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useBugAttachmentDownload() {
  const downloadingId = ref<number | null>(null);

  async function download(bug: BugDetail, attachment: BugAttachment) {
    downloadingId.value = attachment.id;

    try {
      await bugApi.downloadAttachment(bug.id, attachment.id, attachment.fileName, bug.workspaceCode);
      return true;
    } catch {
      feedback.error(t.bugManagement.attachmentDownloadFailed);
      return false;
    } finally {
      downloadingId.value = null;
    }
  }

  return {
    downloadingId,
    download
  };
}
