import { ref } from 'vue';

import { bugApi, type BugDetail } from '@entities/bug';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useBugCommentAdd() {
  const visible = ref(false);
  const saving = ref(false);
  const current = ref<BugDetail | null>(null);
  const content = ref('');

  function open(bug: BugDetail) {
    current.value = bug;
    content.value = '';
    visible.value = true;
  }

  function close() {
    visible.value = false;
  }

  async function submit() {
    if (!current.value) {
      return false;
    }

    if (!content.value.trim()) {
      feedback.warning(t.bugManagement.commentRequired);
      return false;
    }

    saving.value = true;

    try {
      await bugApi.addComment(
        current.value.id,
        {
          workspaceCode: current.value.workspaceCode,
          content: content.value.trim()
        },
        current.value.workspaceCode
      );
      feedback.success(t.bugManagement.commentSuccess);
      close();
      return true;
    } catch {
      feedback.error(t.bugManagement.commentFailed);
      return false;
    } finally {
      saving.value = false;
    }
  }

  return {
    visible,
    saving,
    content,
    open,
    close,
    submit
  };
}
