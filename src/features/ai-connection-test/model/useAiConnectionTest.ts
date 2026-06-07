import { ref } from 'vue';

import { aiModelApi } from '@entities/ai-model';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useAiConnectionTest() {
  const loading = ref(false);

  async function testConnection(id: string) {
    loading.value = true;

    try {
      await aiModelApi.testConnection(id);
      feedback.success(t.aiConnection.testSuccess);
    } catch {
      feedback.error(t.aiConnection.testFailed);
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    testConnection
  };
}
