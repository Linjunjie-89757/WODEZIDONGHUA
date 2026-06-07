import type {
  ApiDefinitionCaseDetail,
  ApiDefinitionCaseFormValues,
  SaveApiDefinitionCasePayload
} from '../model/types';
import {
  createDefaultRequestConfig,
  normalizeProcessors,
  toRequestConfig
} from './requestConfig';

export function createDefaultCaseForm(definitionId: number | null): ApiDefinitionCaseFormValues {
  return {
    definitionId,
    name: '',
    description: '',
    priority: 'P2',
    status: 'ACTIVE',
    method: 'GET',
    path: '/auth/me',
    timeoutMs: 10000,
    queryKey: '',
    queryValue: '',
    headerKey: '',
    headerValue: '',
    rawBody: '',
    assertions: [],
    preProcessors: [],
    postProcessors: []
  };
}

export function createCaseEditForm(detail: ApiDefinitionCaseDetail): ApiDefinitionCaseFormValues {
  const requestConfig = detail.requestConfig || createDefaultRequestConfig();
  const firstQuery = requestConfig.queryParams?.find((item) => item.enabled !== false);
  const firstHeader = requestConfig.headers?.find((item) => item.enabled !== false);

  return {
    definitionId: detail.definitionId,
    name: detail.name,
    description: detail.description || '',
    priority: detail.priority || 'P2',
    status: detail.status || 'ACTIVE',
    method: requestConfig.method || 'GET',
    path: requestConfig.path || '/auth/me',
    timeoutMs: requestConfig.timeoutMs || 10000,
    queryKey: firstQuery?.key || '',
    queryValue: firstQuery?.value || '',
    headerKey: firstHeader?.key || '',
    headerValue: firstHeader?.value || '',
    rawBody: requestConfig.body?.rawText || '',
    assertions: detail.assertions || [],
    preProcessors: normalizeProcessors(detail.preProcessors),
    postProcessors: normalizeProcessors(detail.postProcessors)
  };
}

export function toSaveCasePayload(
  form: ApiDefinitionCaseFormValues,
  workspaceCode?: string
): SaveApiDefinitionCasePayload {
  return {
    workspaceCode,
    definitionId: form.definitionId || 0,
    name: form.name.trim(),
    description: form.description.trim() || null,
    priority: form.priority.trim() || null,
    status: form.status.trim() || null,
    requestConfig: toRequestConfig(form),
    assertions: form.assertions || [],
    extractors: [],
    preProcessors: normalizeProcessors(form.preProcessors),
    postProcessors: normalizeProcessors(form.postProcessors)
  };
}
