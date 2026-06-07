import { ref } from 'vue';

import {
  aiModelApi,
  createAiConnectionEditForm,
  createDefaultAiConnectionForm,
  toSaveAiConnectionPayload,
  type AiConnection,
  type AiConnectionFormValues
} from '@entities/ai-model';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useAiConnectionEdit() {
  const visible = ref(false);
  const saving = ref(false);
  const current = ref<AiConnection | null>(null);
  const form = ref<AiConnectionFormValues>(createDefaultAiConnectionForm());

  function open(connection: AiConnection) {
    current.value = connection;
    form.value = createAiConnectionEditForm(connection);
    visible.value = true;
  }

  function close() {
    visible.value = false;
  }

  async function submit() {
    if (!current.value) {
      return false;
    }

    if (!form.value.connectionName.trim() || !form.value.baseUrl.trim()) {
      feedback.warning(t.aiConnection.requiredFieldsMissing);
      return false;
    }

    const workspaceStore = useWorkspaceStore();
    saving.value = true;

    try {
      await aiModelApi.updateConnection(
        current.value.id,
        toSaveAiConnectionPayload(form.value, workspaceStore.currentWorkspace.code),
        workspaceStore.currentWorkspace.code
      );
      feedback.success(t.aiConnection.updateSuccess);
      close();
      return true;
    } catch {
      feedback.error(t.aiConnection.updateFailed);
      return false;
    } finally {
      saving.value = false;
    }
  }

  return {
    visible,
    saving,
    current,
    form,
    open,
    close,
    submit
  };
}
