export type AiProvider = 'openai' | 'azure-openai' | 'ollama' | 'custom';

export type AiProtocolType =
  | 'OPENAI_COMPATIBLE_CHAT'
  | 'OPENAI_COMPATIBLE_RESPONSES'
  | 'AZURE_OPENAI';

export interface AiConnection {
  id: number;
  workspaceCode: string;
  workspaceName?: string;
  name: string;
  protocolType: AiProtocolType | string;
  provider: AiProvider;
  model: string;
  baseUrl: string;
  requestTimeoutSeconds?: number;
  apiKeyMasked?: string;
  apiKeyConfigured: boolean;
  enabled: boolean;
  status: 'ready' | 'disabled' | 'error';
  modelCount?: number;
  lastVerifiedAt?: string;
  lastFetchModelsAt?: string;
}

export interface AiProviderMeta {
  label: string;
  value: AiProvider;
  color: string;
}

export interface AiProviderConnectionResponse {
  id: number;
  workspaceCode: string;
  workspaceName?: string;
  connectionName: string;
  protocolType: string;
  baseUrl: string;
  requestTimeoutSeconds?: number;
  modelName?: string;
  apiKeyMasked?: string;
  apiKeyConfigured: boolean;
  status: number;
  modelCount?: number;
  lastVerifiedAt?: string;
  lastFetchModelsAt?: string;
}

export interface SaveAiProviderConnectionPayload {
  workspaceCode?: string;
  connectionName: string;
  protocolType: AiProtocolType | string;
  baseUrl: string;
  requestTimeoutSeconds?: number;
  modelName?: string;
  apiKey?: string;
  status?: number;
}

export interface AiConnectionFormValues {
  connectionName: string;
  protocolType: AiProtocolType;
  baseUrl: string;
  requestTimeoutSeconds: number;
  modelName?: string;
  apiKey?: string;
  status: number;
}
