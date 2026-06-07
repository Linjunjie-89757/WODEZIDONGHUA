import { computed, ref } from 'vue';

import {
  bugApi,
  createDefaultBugForm,
  toSaveBugPayload,
  type BugFormValues
} from '@entities/bug';
import { userApi, type UserItem } from '@entities/user';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useBugCreate() {
  const visible = ref(false);
  const saving = ref(false);
  const loadingUsers = ref(false);
  const users = ref<UserItem[]>([]);
  const form = ref<BugFormValues>(createDefaultBugForm());

  const userOptions = computed(() =>
    users.value.map((user) => ({
      label: user.displayName || user.username,
      value: user.id
    }))
  );

  function resetForm() {
    form.value = createDefaultBugForm();
  }

  async function loadUsers() {
    loadingUsers.value = true;

    try {
      users.value = await userApi.listUsers();
    } catch {
      users.value = [];
      feedback.warning(t.bugManagement.userLoadFailed);
    } finally {
      loadingUsers.value = false;
    }
  }

  async function open() {
    resetForm();
    visible.value = true;
    await loadUsers();
  }

  function close() {
    visible.value = false;
  }

  async function submit() {
    const workspaceStore = useWorkspaceStore();

    if (!form.value.title.trim() || !form.value.description.trim() || !form.value.assigneeId) {
      feedback.warning(t.bugManagement.requiredFieldsMissing);
      return false;
    }

    const workspaceCode = workspaceStore.writableWorkspaceCode;
    if (!workspaceCode) {
      feedback.warning(t.configCenter.workspaceRequiredForWrite);
      return false;
    }

    const payload = toSaveBugPayload(form.value, workspaceCode);
    if (!payload) {
      feedback.warning(t.bugManagement.requiredFieldsMissing);
      return false;
    }

    saving.value = true;

    try {
      await bugApi.createBug(payload, workspaceCode);
      feedback.success(t.bugManagement.createSuccess);
      close();
      resetForm();
      return true;
    } catch {
      feedback.error(t.bugManagement.createFailed);
      return false;
    } finally {
      saving.value = false;
    }
  }

  return {
    visible,
    saving,
    loadingUsers,
    form,
    userOptions,
    open,
    close,
    submit
  };
}
