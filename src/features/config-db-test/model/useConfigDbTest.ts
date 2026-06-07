import { ref } from 'vue';

import {
  configCenterApi,
  toTestDbConnectionPayload,
  type DbConnectionItem
} from '@entities/config-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useConfigDbTest() {
  const testing = ref(false);

  async function testDbConnection(db: DbConnectionItem) {
    const workspaceStore = useWorkspaceStore();
    testing.value = true;

    try {
      const workspaceCode = db.workspaceCode || workspaceStore.currentWorkspace.code;
      const result = await configCenterApi.testDbConnection(
        toTestDbConnectionPayload(db, workspaceCode),
        workspaceCode
      );

      if (result.success) {
        feedback.success(result.message || t.configCenter.dbTestSuccess);
      } else {
        feedback.warning(result.message || t.configCenter.dbTestFailed);
      }

      return true;
    } catch {
      feedback.error(t.configCenter.dbTestFailed);
      return false;
    } finally {
      testing.value = false;
    }
  }

  return {
    testing,
    testDbConnection
  };
}
