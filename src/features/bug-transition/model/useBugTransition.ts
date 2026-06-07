import { computed, ref } from 'vue';

import { bugApi, type BugDetail, type BugStatus } from '@entities/bug';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

const statusOptions: BugStatus[] = [
  'TODO',
  'ASSIGNED',
  'IN_PROGRESS',
  'PENDING_VERIFY',
  'CLOSED',
  'REJECTED'
];

export function useBugTransition() {
  const visible = ref(false);
  const saving = ref(false);
  const current = ref<BugDetail | null>(null);
  const toStatus = ref<BugStatus>('IN_PROGRESS');
  const actionComment = ref('');

  const options = computed(() =>
    statusOptions
      .filter((status) => status !== current.value?.status)
      .map((status) => ({
        label: status,
        value: status
      }))
  );

  function open(bug: BugDetail) {
    current.value = bug;
    toStatus.value = statusOptions.find((status) => status !== bug.status) || 'IN_PROGRESS';
    actionComment.value = '';
    visible.value = true;
  }

  function close() {
    visible.value = false;
  }

  async function submit() {
    if (!current.value) {
      return false;
    }

    saving.value = true;

    try {
      await bugApi.transitionBug(
        current.value.id,
        {
          workspaceCode: current.value.workspaceCode,
          toStatus: toStatus.value,
          actionComment: actionComment.value.trim()
        },
        current.value.workspaceCode
      );
      feedback.success(t.bugManagement.transitionSuccess);
      close();
      return true;
    } catch {
      feedback.error(t.bugManagement.transitionFailed);
      return false;
    } finally {
      saving.value = false;
    }
  }

  return {
    visible,
    saving,
    current,
    toStatus,
    actionComment,
    options,
    open,
    close,
    submit
  };
}
