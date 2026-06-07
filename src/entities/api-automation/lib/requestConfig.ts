import type {
  ApiAuthConfig,
  ApiAssertionConfig,
  ApiDefinitionDetail,
  ApiDefinitionFormValues,
  ApiKeyValue,
  ApiProcessorConfig,
  ApiRequestConfig,
  SaveApiDefinitionPayload
} from '../model/types';

const supportedAssertionTypes = new Set([
  'RESPONSE_CODE',
  'RESPONSE_HEADER',
  'RESPONSE_BODY',
  'RESPONSE_TIME'
]);

function emptyAuthCredential() {
  return {
    userName: '',
    password: ''
  };
}

function createDefaultAuthConfig(): ApiAuthConfig {
  return {
    authType: 'NONE',
    basicAuth: emptyAuthCredential(),
    digestAuth: emptyAuthCredential()
  };
}

function normalizeAuthConfig(authConfig?: Partial<ApiAuthConfig> | null): ApiAuthConfig {
  const authType = authConfig?.authType === 'BASIC' || authConfig?.authType === 'DIGEST'
    ? authConfig.authType
    : 'NONE';

  return {
    authType,
    basicAuth: {
      ...emptyAuthCredential(),
      ...(authConfig?.basicAuth || {})
    },
    digestAuth: {
      ...emptyAuthCredential(),
      ...(authConfig?.digestAuth || {})
    }
  };
}

function enabledPair(key: string, value: string): ApiKeyValue[] {
  const trimmedKey = key.trim();

  if (!trimmedKey) {
    return [];
  }

  return [
    {
      key: trimmedKey,
      value,
      enabled: true
    }
  ];
}

export function createDefaultRequestConfig(): ApiRequestConfig {
  return {
    method: 'GET',
    path: '/auth/me',
    timeoutMs: 10000,
    queryParams: [],
    headers: [],
    cookies: [],
    body: {
      type: 'RAW',
      rawText: '',
      formItems: [],
      contentType: 'application/json'
    },
    authConfig: createDefaultAuthConfig()
  };
}

function normalizeAssertions(assertions: ApiAssertionConfig[] | undefined): ApiAssertionConfig[] {
  return (assertions || [])
    .filter((assertion) => supportedAssertionTypes.has(assertion.assertionType))
    .map((assertion) => ({
      ...assertion,
      enabled: assertion.enabled !== false
    }));
}

export function normalizeProcessors(processors: ApiProcessorConfig[] | undefined): ApiProcessorConfig[] {
  return (processors || [])
    .filter((processor) => processor.enabled !== false)
    .map((processor) => ({
      ...processor,
      enabled: processor.enabled !== false
    }));
}

export function createDefaultDefinitionForm(): ApiDefinitionFormValues {
  return {
    name: '',
    directoryName: '',
    description: '',
    method: 'GET',
    path: '/auth/me',
    timeoutMs: 10000,
    queryKey: '',
    queryValue: '',
    headerKey: '',
    headerValue: '',
    rawBody: '',
    authConfig: createDefaultAuthConfig(),
    assertions: [],
    preProcessors: [],
    postProcessors: []
  };
}

export function createDefinitionEditForm(detail: ApiDefinitionDetail): ApiDefinitionFormValues {
  const firstQuery = detail.requestConfig.queryParams.find((item) => item.enabled !== false);
  const firstHeader = detail.requestConfig.headers.find((item) => item.enabled !== false);

  return {
    name: detail.name,
    directoryName: detail.directoryName || '',
    description: detail.description || '',
    method: detail.requestConfig.method || detail.method || 'GET',
    path: detail.requestConfig.path || detail.path || '/auth/me',
    timeoutMs: detail.requestConfig.timeoutMs || 10000,
    queryKey: firstQuery?.key || '',
    queryValue: firstQuery?.value || '',
    headerKey: firstHeader?.key || '',
    headerValue: firstHeader?.value || '',
    rawBody: detail.requestConfig.body?.rawText || '',
    authConfig: normalizeAuthConfig(detail.requestConfig.authConfig),
    assertions: normalizeAssertions(detail.assertions),
    preProcessors: normalizeProcessors(detail.preProcessors),
    postProcessors: normalizeProcessors(detail.postProcessors)
  };
}

export function toRequestConfig(form: ApiDefinitionFormValues): ApiRequestConfig {
  return {
    ...createDefaultRequestConfig(),
    method: form.method,
    path: form.path.trim(),
    timeoutMs: Number(form.timeoutMs) || 10000,
    queryParams: enabledPair(form.queryKey, form.queryValue),
    headers: enabledPair(form.headerKey, form.headerValue),
    body: {
      type: 'RAW',
      rawText: form.rawBody,
      formItems: [],
      contentType: 'application/json'
    },
    authConfig: normalizeAuthConfig(form.authConfig)
  };
}

export function toSaveDefinitionPayload(
  form: ApiDefinitionFormValues,
  workspaceCode?: string
): SaveApiDefinitionPayload {
  return {
    workspaceCode,
    name: form.name.trim(),
    directoryName: form.directoryName.trim() || null,
    description: form.description.trim() || null,
    tags: [],
    requestConfig: toRequestConfig(form),
    assertions: normalizeAssertions(form.assertions),
    extractors: [],
    preProcessors: normalizeProcessors(form.preProcessors),
    postProcessors: normalizeProcessors(form.postProcessors)
  };
}
