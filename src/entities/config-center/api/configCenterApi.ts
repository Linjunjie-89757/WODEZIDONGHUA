import { endpoints } from '@shared/api/endpoints';
import { request, withWorkspace } from '@shared/api/request';

import type {
  DbConnectionItem,
  DbConnectionTestResult,
  EnvConfigItem,
  PageResponse,
  ParamSetItem,
  SaveDbConnectionPayload,
  SaveEnvConfigPayload,
  SaveParamSetPayload,
  TestDbConnectionPayload,
  UpdateSettingStatusPayload
} from '../model/types';

function normalizePage<T>(page: PageResponse<T> | T[] | undefined): PageResponse<T> {
  if (Array.isArray(page)) {
    return {
      items: page,
      total: page.length,
      pageNo: 1,
      pageSize: page.length,
      totalPages: page.length ? 1 : 0
    };
  }

  return {
    items: page?.items || [],
    total: page?.total || 0,
    pageNo: page?.pageNo || 1,
    pageSize: page?.pageSize || page?.items?.length || 0,
    totalPages: page?.totalPages || 0
  };
}

export const configCenterApi = {
  async listEnvs(workspaceCode?: string) {
    const page = await request.get<unknown, PageResponse<EnvConfigItem>>(
      endpoints.configCenter.envs,
      withWorkspace(workspaceCode)
    );
    return normalizePage(page);
  },
  createEnv(payload: SaveEnvConfigPayload, workspaceCode?: string) {
    return request.post<unknown, EnvConfigItem>(
      endpoints.configCenter.createEnv,
      payload,
      withWorkspace(workspaceCode)
    );
  },
  updateEnv(id: number | string, payload: SaveEnvConfigPayload, workspaceCode?: string) {
    return request.put<unknown, EnvConfigItem>(
      endpoints.configCenter.updateEnv(id),
      payload,
      withWorkspace(workspaceCode)
    );
  },
  updateEnvStatus(id: number | string, status: number, workspaceCode?: string) {
    const payload: UpdateSettingStatusPayload = { status };

    return request.put<unknown, EnvConfigItem>(
      endpoints.configCenter.updateEnvStatus(id),
      payload,
      withWorkspace(workspaceCode)
    );
  },
  deleteEnv(id: number | string, workspaceCode?: string) {
    return request.delete(endpoints.configCenter.deleteEnv(id), withWorkspace(workspaceCode));
  },
  async listParams(workspaceCode?: string) {
    const page = await request.get<unknown, PageResponse<ParamSetItem>>(
      endpoints.configCenter.params,
      withWorkspace(workspaceCode)
    );
    return normalizePage(page);
  },
  createParam(payload: SaveParamSetPayload, workspaceCode?: string) {
    return request.post<unknown, ParamSetItem>(
      endpoints.configCenter.createParam,
      payload,
      withWorkspace(workspaceCode)
    );
  },
  updateParam(id: number | string, payload: SaveParamSetPayload, workspaceCode?: string) {
    return request.put<unknown, ParamSetItem>(
      endpoints.configCenter.updateParam(id),
      payload,
      withWorkspace(workspaceCode)
    );
  },
  updateParamStatus(id: number | string, status: number, workspaceCode?: string) {
    const payload: UpdateSettingStatusPayload = { status };

    return request.put<unknown, ParamSetItem>(
      endpoints.configCenter.updateParamStatus(id),
      payload,
      withWorkspace(workspaceCode)
    );
  },
  deleteParam(id: number | string, workspaceCode?: string) {
    return request.delete(endpoints.configCenter.deleteParam(id), withWorkspace(workspaceCode));
  },
  async listDbConnections(workspaceCode?: string) {
    const page = await request.get<unknown, PageResponse<DbConnectionItem>>(
      endpoints.configCenter.dbConnections,
      withWorkspace(workspaceCode)
    );
    return normalizePage(page);
  },
  createDbConnection(payload: SaveDbConnectionPayload, workspaceCode?: string) {
    return request.post<unknown, DbConnectionItem>(
      endpoints.configCenter.createDbConnection,
      payload,
      withWorkspace(workspaceCode)
    );
  },
  updateDbConnection(id: number | string, payload: SaveDbConnectionPayload, workspaceCode?: string) {
    return request.put<unknown, DbConnectionItem>(
      endpoints.configCenter.updateDbConnection(id),
      payload,
      withWorkspace(workspaceCode)
    );
  },
  updateDbConnectionStatus(id: number | string, status: number, workspaceCode?: string) {
    const payload: UpdateSettingStatusPayload = { status };

    return request.put<unknown, DbConnectionItem>(
      endpoints.configCenter.updateDbConnectionStatus(id),
      payload,
      withWorkspace(workspaceCode)
    );
  },
  deleteDbConnection(id: number | string, workspaceCode?: string) {
    return request.delete(
      endpoints.configCenter.deleteDbConnection(id),
      withWorkspace(workspaceCode)
    );
  },
  testDbConnection(payload: TestDbConnectionPayload, workspaceCode?: string) {
    return request.post<unknown, DbConnectionTestResult>(
      endpoints.configCenter.testDbConnection,
      payload,
      withWorkspace(workspaceCode)
    );
  }
};
