import { endpoints } from '@shared/api/endpoints';
import { request, withWorkspace } from '@shared/api/request';

import { normalizeAiProvider } from '../lib/providerMeta';
import type {
  AiConnection,
  AiProviderConnectionResponse,
  SaveAiProviderConnectionPayload
} from '../model/types';

function normalizeConnection(item: AiProviderConnectionResponse): AiConnection {
  return {
    id: item.id,
    workspaceCode: item.workspaceCode,
    workspaceName: item.workspaceName,
    name: item.connectionName,
    protocolType: item.protocolType,
    provider: normalizeAiProvider(item.protocolType),
    model: item.modelName || '-',
    baseUrl: item.baseUrl,
    requestTimeoutSeconds: item.requestTimeoutSeconds,
    apiKeyMasked: item.apiKeyMasked,
    apiKeyConfigured: item.apiKeyConfigured,
    enabled: item.status === 1,
    status: item.status === 1 ? 'ready' : item.status === 0 ? 'disabled' : 'error',
    modelCount: item.modelCount,
    lastVerifiedAt: item.lastVerifiedAt,
    lastFetchModelsAt: item.lastFetchModelsAt
  };
}

export const aiModelApi = {
  async listConnections(workspaceCode?: string) {
    const list = await request.get<unknown, AiProviderConnectionResponse[]>(
      endpoints.aiModel.connections,
      withWorkspace(workspaceCode)
    );
    return list.map(normalizeConnection);
  },
  async createConnection(payload: SaveAiProviderConnectionPayload, workspaceCode?: string) {
    const connection = await request.post<unknown, AiProviderConnectionResponse>(
      endpoints.aiModel.createConnection,
      payload,
      withWorkspace(workspaceCode)
    );
    return normalizeConnection(connection);
  },
  async updateConnection(
    id: number | string,
    payload: SaveAiProviderConnectionPayload,
    workspaceCode?: string
  ) {
    const connection = await request.put<unknown, AiProviderConnectionResponse>(
      endpoints.aiModel.updateConnection(id),
      payload,
      withWorkspace(workspaceCode)
    );
    return normalizeConnection(connection);
  },
  deleteConnection(id: number | string, workspaceCode?: string) {
    return request.delete(endpoints.aiModel.deleteConnection(id), withWorkspace(workspaceCode));
  },
  testConnection(id: number | string, workspaceCode?: string) {
    return request.post(endpoints.aiModel.testConnection(id), undefined, withWorkspace(workspaceCode));
  }
};
