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

function emptyKeyValue(): ApiKeyValue {
  return {
    key: '',
    value: '',
    description: '',
    enabled: true,
    paramType: 'string',
    required: false,
    encode: false,
    minLength: null,
    maxLength: null,
    fileName: '',
    contentType: '',
    fileBase64: ''
  };
}

function normalizeKeyValues(items: ApiKeyValue[] | undefined): ApiKeyValue[] {
  const normalized = (items || [])
    .map((item) => ({
      ...emptyKeyValue(),
      ...item,
      enabled: item.enabled !== false,
      required: item.required === true,
      encode: item.encode === true,
      minLength: item.minLength ?? null,
      maxLength: item.maxLength ?? null,
      paramType: item.paramType || 'string'
    }))
    .filter((item) => item.key.trim());

  return normalized;
}

function editorRows(items: ApiKeyValue[] | undefined): ApiKeyValue[] {
  const normalized = (items || [])
    .map((item) => ({
      ...emptyKeyValue(),
      ...item,
      enabled: item.enabled !== false,
      required: item.required === true,
      encode: item.encode === true,
      minLength: item.minLength ?? null,
      maxLength: item.maxLength ?? null,
      paramType: item.paramType || 'string'
    }));

  return normalized.length ? normalized : [emptyKeyValue()];
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
      type: 'RAW_JSON',
      rawText: '',
      formItems: [],
      contentType: 'application/json',
      jsonText: '',
      xmlText: '',
      plainText: ''
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
    queryParams: [emptyKeyValue()],
    headerKey: '',
    headerValue: '',
    headers: [emptyKeyValue()],
    bodyType: 'RAW_JSON',
    rawBody: '',
    bodyFormItems: [emptyKeyValue()],
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
    queryParams: editorRows(detail.requestConfig.queryParams),
    headerKey: firstHeader?.key || '',
    headerValue: firstHeader?.value || '',
    headers: editorRows(detail.requestConfig.headers),
    bodyType: detail.requestConfig.body?.type || 'RAW_JSON',
    rawBody: detail.requestConfig.body?.jsonText
      || detail.requestConfig.body?.xmlText
      || detail.requestConfig.body?.plainText
      || detail.requestConfig.body?.rawText
      || '',
    bodyFormItems: editorRows(detail.requestConfig.body?.formItems),
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
    queryParams: normalizeKeyValues(form.queryParams).length
      ? normalizeKeyValues(form.queryParams)
      : enabledPair(form.queryKey, form.queryValue),
    headers: normalizeKeyValues(form.headers).length
      ? normalizeKeyValues(form.headers)
      : enabledPair(form.headerKey, form.headerValue),
    body: {
      type: form.bodyType || 'RAW_JSON',
      rawText: form.rawBody,
      jsonText: form.bodyType === 'RAW_JSON' ? form.rawBody : '',
      xmlText: form.bodyType === 'RAW_XML' ? form.rawBody : '',
      plainText: form.bodyType === 'RAW_TEXT' ? form.rawBody : '',
      formItems: normalizeKeyValues(form.bodyFormItems),
      contentType: contentTypeForBodyType(form.bodyType)
    },
    authConfig: normalizeAuthConfig(form.authConfig)
  };
}

function contentTypeForBodyType(bodyType: string) {
  if (bodyType === 'FORM_URLENCODED') {
    return 'application/x-www-form-urlencoded';
  }

  if (bodyType === 'RAW_XML') {
    return 'application/xml';
  }

  if (bodyType === 'RAW_TEXT') {
    return 'text/plain';
  }

  return 'application/json';
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
