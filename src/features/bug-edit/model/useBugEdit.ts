import { computed, ref } from 'vue';

import {
  bugApi,
  createBugEditForm,
  createDefaultBugForm,
  toSaveBugPayload,
  type BugDetail,
  type BugFormValues,
  type BugSummary
} from '@entities/bug';
import { userApi, type UserItem } from '@entities/user';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useBugEdit() {
  const visible = ref(false);
  const loadingDetail = ref(false);
  const loadingUsers = ref(false);
  const saving = ref(false);
  const current = ref<BugDetail | BugSummary | null>(null);
  const users = ref<UserItem[]>([]);
  const form = ref<BugFormValues>(createDefaultBugForm());

  const userOptions = computed(() =>
    users.value.map((user) => ({
      label: user.displayName || user.username,
      value: user.id
    }))
  );

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

  async function open(bug: BugSummary) {
    current.value = bug;
    form.value = createBugEditForm(bug);
    visible.value = true;

    const workspaceStore = useWorkspaceStore();
    loadingDetail.value = true;

    try {
      await loadUsers();
      const workspaceCode = bug.workspaceCode || workspaceStore.currentWorkspace.code;
      const detail = await bugApi.getBugDetail(bug.id, workspaceCode);
      current.value = detail;
      form.value = createBugEditForm(detail);
    } catch {
      feedback.warning(t.bugManagement.detailLoadFailed);
    } finally {
      loadingDetail.value = false;
    }
  }

  function close() {
    visible.value = false;
  }

  async function submit() {
    if (!current.value) {
      return false;
    }

    if (!form.value.title.trim() || !form.value.description.trim() || !form.value.assigneeId) {
      feedback.warning(t.bugManagement.requiredFieldsMissing);
      return false;
    }

    const workspaceStore = useWorkspaceStore();
    const workspaceCode = current.value.workspaceCode || workspaceStore.writableWorkspaceCode;
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
      await bugApi.updateBug(current.value.id, payload, workspaceCode);
      feedback.success(t.bugManagement.updateSuccess);
      close();
      return true;
    } catch {
      feedback.error(t.bugManagement.updateFailed);
      return false;
    } finally {
      saving.value = false;
    }
  }

  return {
    visible,
    loadingDetail,
    loadingUsers,
    saving,
    current,
    form,
    userOptions,
    open,
    close,
    submit
  };
}
