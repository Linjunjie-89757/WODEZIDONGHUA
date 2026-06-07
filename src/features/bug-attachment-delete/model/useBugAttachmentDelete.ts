import { ref } from 'vue';

import { bugApi, type BugAttachment, type BugDetail } from '@entities/bug';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useBugAttachmentDelete() {
  const deletingId = ref<number | null>(null);

  async function deleteAttachment(bug: BugDetail, attachment: BugAttachment) {
    deletingId.value = attachment.id;

    try {
      await bugApi.deleteAttachment(bug.id, attachment.id, bug.workspaceCode);
      feedback.success(t.bugManagement.attachmentDeleteSuccess);
      return true;
    } catch {
      feedback.error(t.bugManagement.attachmentDeleteFailed);
      return false;
    } finally {
      deletingId.value = null;
    }
  }

  function confirmDelete(bug: BugDetail, attachment: BugAttachment, onSuccess: () => void) {
    feedback.confirm(t.bugManagement.attachmentDeleteConfirm, t.common.confirmAction, async () => {
      const succeed = await deleteAttachment(bug, attachment);

      if (succeed) {
        onSuccess();
      }
    });
  }

  return {
    deletingId,
    confirmDelete
  };
}
