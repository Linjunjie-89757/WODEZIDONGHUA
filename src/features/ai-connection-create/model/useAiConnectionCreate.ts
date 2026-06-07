import { ref } from 'vue';

import {
  aiModelApi,
  createDefaultAiConnectionForm,
  toSaveAiConnectionPayload,
  type AiConnectionFormValues
} from '@entities/ai-model';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useAiConnectionCreate() {
  const visible = ref(false);
  const saving = ref(false);
  const form = ref<AiConnectionFormValues>(createDefaultAiConnectionForm());

  function resetForm() {
    form.value = createDefaultAiConnectionForm();
  }

  function close() {
    visible.value = false;
  }

  async function submit() {
    const workspaceStore = useWorkspaceStore();

    if (!form.value.connectionName.trim() || !form.value.baseUrl.trim()) {
      feedback.warning(t.aiConnection.requiredFieldsMissing);
      return false;
    }

    saving.value = true;

    try {
      await aiModelApi.createConnection(
        toSaveAiConnectionPayload(form.value, workspaceStore.currentWorkspace.code, {
          includeBlankApiKey: true
        }),
        workspaceStore.currentWorkspace.code
      );
      feedback.success(t.aiConnection.createSuccess);
      close();
      resetForm();
      return true;
    } catch {
      feedback.error(t.aiConnection.createFailed);
      return false;
    } finally {
      saving.value = false;
    }
  }

  return {
    visible,
    saving,
    form,
    open: () => {
      resetForm();
      visible.value = true;
    },
    close,
    submit
  };
}
