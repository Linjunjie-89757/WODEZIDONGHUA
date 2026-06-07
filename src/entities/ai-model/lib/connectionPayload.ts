import type {
  AiConnection,
  AiConnectionFormValues,
  AiProtocolType,
  SaveAiProviderConnectionPayload
} from '../model/types';

export const aiProtocolOptions: Array<{ label: string; value: AiProtocolType }> = [
  {
    label: 'OpenAI Chat Completions',
    value: 'OPENAI_COMPATIBLE_CHAT'
  },
  {
    label: 'OpenAI Responses',
    value: 'OPENAI_COMPATIBLE_RESPONSES'
  },
  {
    label: 'Azure OpenAI',
    value: 'AZURE_OPENAI'
  }
];

export function createDefaultAiConnectionForm(): AiConnectionFormValues {
  return {
    connectionName: '',
    protocolType: 'OPENAI_COMPATIBLE_CHAT',
    baseUrl: '',
    requestTimeoutSeconds: 60,
    modelName: '',
    apiKey: '',
    status: 1
  };
}

export function createAiConnectionEditForm(connection: AiConnection): AiConnectionFormValues {
  return {
    connectionName: connection.name,
    protocolType: normalizeProtocolType(connection.protocolType),
    baseUrl: connection.baseUrl,
    requestTimeoutSeconds: connection.requestTimeoutSeconds || 60,
    modelName: connection.model === '-' ? '' : connection.model,
    apiKey: '',
    status: connection.enabled ? 1 : 0
  };
}

export function toSaveAiConnectionPayload(
  form: AiConnectionFormValues,
  workspaceCode?: string,
  options: { includeBlankApiKey?: boolean } = {}
): SaveAiProviderConnectionPayload {
  const apiKey = form.apiKey?.trim();
  const modelName = form.modelName?.trim();

  return {
    ...(workspaceCode ? { workspaceCode } : {}),
    connectionName: form.connectionName.trim(),
    protocolType: form.protocolType,
    baseUrl: form.baseUrl.trim(),
    requestTimeoutSeconds: form.requestTimeoutSeconds,
    ...(modelName ? { modelName } : {}),
    ...(apiKey || options.includeBlankApiKey ? { apiKey: apiKey || '' } : {}),
    status: form.status
  };
}

function normalizeProtocolType(protocolType?: string): AiProtocolType {
  if (
    protocolType === 'OPENAI_COMPATIBLE_CHAT' ||
    protocolType === 'OPENAI_COMPATIBLE_RESPONSES' ||
    protocolType === 'AZURE_OPENAI'
  ) {
    return protocolType;
  }

  return 'OPENAI_COMPATIBLE_CHAT';
}
