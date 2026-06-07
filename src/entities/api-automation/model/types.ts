export interface PageResponse<T> {
  items: T[];
  total: number;
  pageNo?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface ApiKeyValue {
  key: string;
  value: string;
  description?: string;
  enabled?: boolean;
  paramType?: string;
  required?: boolean;
  encode?: boolean;
}

export interface ApiAuthCredential {
  userName: string;
  password: string;
}

export interface ApiAuthConfig {
  authType: string;
  basicAuth?: ApiAuthCredential | null;
  digestAuth?: ApiAuthCredential | null;
}

export interface ApiRequestBodyConfig {
  type: string;
  rawText?: string | null;
  formItems: ApiKeyValue[];
  contentType?: string | null;
  fileName?: string | null;
  binaryBase64?: string | null;
}

export interface ApiRequestConfig {
  method: string;
  path: string;
  timeoutMs?: number | null;
  queryParams: ApiKeyValue[];
  headers: ApiKeyValue[];
  cookies: ApiKeyValue[];
  body: ApiRequestBodyConfig;
  authConfig: ApiAuthConfig;
}

export type ApiAssertionType =
  | 'RESPONSE_CODE'
  | 'RESPONSE_HEADER'
  | 'RESPONSE_BODY'
  | 'RESPONSE_TIME';

export type ApiAssertionCondition =
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'CONTAINS'
  | 'NOT_CONTAINS'
  | 'EMPTY'
  | 'NOT_EMPTY'
  | 'REGEX'
  | 'GT'
  | 'GT_OR_EQUALS'
  | 'LT'
  | 'LT_OR_EQUALS';

export interface ApiAssertionItemConfig {
  header?: string;
  expression?: string;
  condition?: ApiAssertionCondition | string;
  expectedValue?: string;
  enabled?: boolean;
}

export interface ApiAssertionGroupConfig {
  assertions: ApiAssertionItemConfig[];
  responseFormat?: 'XML' | 'HTML';
}

export interface ApiAssertionConfig {
  id?: string;
  assertionType: ApiAssertionType;
  name?: string;
  enabled?: boolean;
  condition?: ApiAssertionCondition | string;
  expectedValue?: string;
  assertions?: ApiAssertionItemConfig[];
  assertionBodyType?: 'JSON_PATH' | 'X_PATH' | 'REGEX';
  jsonPathAssertion?: ApiAssertionGroupConfig;
  xpathAssertion?: ApiAssertionGroupConfig;
  regexAssertion?: ApiAssertionGroupConfig;
}

export interface ApiDefinitionItem {
  id: number;
  workspaceCode: string;
  workspaceName: string;
  name: string;
  method: string;
  path: string;
  directoryName: string | null;
  description: string | null;
  tags: string[];
  lastRunResult: string | null;
  lastRunAt: string | null;
  updatedAt: string | null;
}

export interface ApiDefinitionDetail extends ApiDefinitionItem {
  requestConfig: ApiRequestConfig;
  assertions: ApiAssertionConfig[];
  extractors: ApiProcessorExtractorConfig[];
  preProcessors: ApiProcessorConfig[];
  postProcessors: ApiProcessorConfig[];
  createdAt: string | null;
}

export interface ApiDefinitionModuleItem {
  id: number;
  workspaceCode: string;
  workspaceName: string;
  parentId: number | null;
  name: string;
  fullPath: string;
  sortOrder: number | null;
  definitionCount: number;
  children: ApiDefinitionModuleItem[];
}

export interface ApiEnvironmentItem {
  id: number;
  workspaceCode: string;
  workspaceName: string;
  name: string;
  baseUrl: string;
  headers: ApiKeyValue[];
  authConfig: ApiAuthConfig;
  timeoutMs: number;
  status: number;
}

export interface ApiVariableItem {
  name: string;
  value: string;
  sensitive?: boolean;
}

export interface ApiVariableSetItem {
  id: number;
  workspaceCode: string;
  workspaceName: string;
  name: string;
  variables: ApiVariableItem[];
  status: number;
}

export interface ApiRequestSnapshot {
  method: string;
  url: string;
  headers: Record<string, string>;
  queryParams?: ApiKeyValue[] | null;
  cookies?: ApiKeyValue[] | null;
  bodyType?: string | null;
  bodyContentType?: string | null;
  bodyFormItems?: ApiKeyValue[] | null;
  bodyFileName?: string | null;
  bodyFileContentType?: string | null;
  body: string | null;
}

export interface ApiResponseSnapshot {
  statusCode: number;
  headers: Record<string, string>;
  body: string | null;
  contentType: string | null;
}

export interface ApiAssertionResult {
  id?: string | null;
  type: string;
  name?: string | null;
  subject: string;
  condition?: string | null;
  expectedValue?: string | null;
  actualValue?: string | null;
  success: boolean;
  message: string;
}

export type ApiProcessorType = 'SCRIPT' | 'SQL' | 'TIME_WAITING' | 'EXTRACT';
export type ApiProcessorStage = 'pre' | 'post';
export type ApiExtractorType = 'JSON_PATH' | 'X_PATH' | 'REGEX';
export type ApiExtractScope = 'BODY' | 'HEADER';
export type ApiVariableType = 'TEMPORARY' | 'ENVIRONMENT' | 'GLOBAL';

export interface ApiProcessorExtractorConfig {
  name: string;
  variableName: string;
  description?: string;
  variableType?: ApiVariableType | string;
  extractType?: ApiExtractorType | string;
  extractScope?: ApiExtractScope | string;
  expression: string;
  expressionMatchingRule?: string;
  resultMatchingRule?: string;
  resultMatchingRuleNum?: number;
  responseFormat?: string;
  enabled?: boolean;
}

export interface ApiProcessorConfig {
  id?: string;
  name: string;
  type: ApiProcessorType | string;
  enabled?: boolean;
  description?: string;
  script?: string;
  scriptLanguage?: string;
  dataSourceId?: number | string | null;
  dataSourceName?: string;
  queryTimeout?: number | null;
  sql?: string;
  variableNames?: string[];
  extractParams?: ApiProcessorExtractorConfig[];
  resultVariable?: string;
  delayMs?: number | null;
  durationMs?: number | null;
  extractors?: ApiProcessorExtractorConfig[];
}

export interface ApiExtractionResult {
  name?: string | null;
  variableName?: string | null;
  value?: string | null;
  success?: boolean;
  message?: string | null;
}

export interface ApiProcessorResult {
  name?: string | null;
  type?: string | null;
  success?: boolean;
  durationMs?: number | null;
  message?: string | null;
  output?: string | null;
}

export interface ApiRunStepResult {
  id: number | null;
  reportId: number | null;
  stepOrder: number;
  stepName: string;
  definitionId: number | null;
  success: boolean;
  durationMs: number;
  request: ApiRequestSnapshot | null;
  response: ApiResponseSnapshot | null;
  assertionResults: ApiAssertionResult[];
  extractionResults: ApiExtractionResult[];
  processorResults: ApiProcessorResult[];
  errorMessage: string | null;
  createdAt: string | null;
}

export interface ApiRunResponse {
  taskId: number;
  reportId: number;
  taskName: string;
  reportName: string;
  result: string;
  failureSummary: string | null;
  stepResults: ApiRunStepResult[];
}

export interface SaveApiDefinitionPayload {
  workspaceCode?: string;
  name: string;
  directoryName?: string | null;
  description?: string | null;
  tags: string[];
  requestConfig: ApiRequestConfig;
  assertions: ApiAssertionConfig[];
  extractors: ApiProcessorExtractorConfig[];
  preProcessors: ApiProcessorConfig[];
  postProcessors: ApiProcessorConfig[];
}

export interface ApiRunPayload {
  workspaceCode?: string;
  environmentId?: number | null;
  variableSetId?: number | null;
}

export interface ApiDefinitionFormValues {
  name: string;
  directoryName: string;
  description: string;
  method: string;
  path: string;
  timeoutMs: number;
  queryKey: string;
  queryValue: string;
  headerKey: string;
  headerValue: string;
  rawBody: string;
  assertions: ApiAssertionConfig[];
  preProcessors: ApiProcessorConfig[];
  postProcessors: ApiProcessorConfig[];
}

export interface ApiDefinitionCaseItem {
  id: number;
  workspaceCode: string;
  workspaceName?: string;
  definitionId: number;
  definitionName?: string;
  name: string;
  priority?: string | null;
  status?: string | null;
  lastRunResult?: string | null;
  lastRunAt?: string | null;
  updatedAt?: string | null;
}

export interface ApiDefinitionCaseDetail extends ApiDefinitionCaseItem {
  description?: string | null;
  requestConfig: ApiRequestConfig;
  assertions: ApiAssertionConfig[];
  extractors: ApiProcessorExtractorConfig[];
  preProcessors: ApiProcessorConfig[];
  postProcessors: ApiProcessorConfig[];
  createdAt?: string | null;
}

export interface SaveApiDefinitionCasePayload {
  workspaceCode?: string;
  definitionId: number | string;
  name: string;
  description?: string | null;
  priority?: string | null;
  status?: string | null;
  requestConfig: ApiRequestConfig;
  assertions: ApiAssertionConfig[];
  extractors: ApiProcessorExtractorConfig[];
  preProcessors: ApiProcessorConfig[];
  postProcessors: ApiProcessorConfig[];
}

export interface ApiDefinitionCaseFormValues {
  definitionId: number | null;
  name: string;
  description: string;
  priority: string;
  status: string;
  method: string;
  path: string;
  timeoutMs: number;
  queryKey: string;
  queryValue: string;
  headerKey: string;
  headerValue: string;
  rawBody: string;
  assertions: ApiAssertionConfig[];
  preProcessors: ApiProcessorConfig[];
  postProcessors: ApiProcessorConfig[];
}

export interface ApiDefinitionCaseRunHistoryItem {
  id: number;
  caseId: number;
  taskId?: number | null;
  reportId?: number | null;
  result?: string | null;
  durationMs?: number | null;
  createdAt?: string | null;
}

export interface ApiDefinitionCaseRunHistoryDetail extends ApiDefinitionCaseRunHistoryItem {
  stepResults: ApiRunStepResult[];
  failureSummary?: string | null;
}

export interface ApiDefinitionCaseChangeHistoryItem {
  id: number;
  caseId: number;
  changeType?: string | null;
  changedBy?: string | null;
  summary?: string | null;
  createdAt?: string | null;
}

export interface ApiScenarioModuleItem {
  id: number;
  workspaceCode: string;
  workspaceName?: string;
  parentId: number | null;
  name: string;
  fullPath: string;
  sortOrder?: number | null;
  scenarioCount?: number;
  children: ApiScenarioModuleItem[];
}

export type ApiScenarioStepType =
  | 'API'
  | 'API_CASE'
  | 'CUSTOM_REQUEST'
  | 'API_SCENARIO'
  | 'IF_CONTROLLER'
  | 'LOOP_CONTROLLER'
  | 'ONCE_ONLY_CONTROLLER'
  | 'CONSTANT_TIMER'
  | 'SCRIPT'
  | 'GROUP'
  | string;

export interface ApiScenarioStep {
  id?: string;
  name: string;
  stepName?: string | null;
  stepType: ApiScenarioStepType;
  enabled?: boolean;
  resource?: string | null;
  resourceId?: number | null;
  resourceType?: 'DEFINITION' | 'CASE' | 'CUSTOM' | string | null;
  definitionId?: number | null;
  definitionName?: string | null;
  caseId?: number | null;
  caseName?: string | null;
  requestConfig?: ApiRequestConfig | null;
  assertions?: ApiAssertionConfig[];
  preProcessors?: ApiProcessorConfig[];
  postProcessors?: ApiProcessorConfig[];
  delayMs?: number | null;
  children?: ApiScenarioStep[];
}

export interface ApiScenarioItem {
  id: number;
  workspaceCode: string;
  workspaceName?: string;
  moduleId?: number | null;
  moduleName?: string | null;
  name: string;
  status?: string | null;
  lastRunResult?: string | null;
  lastRunAt?: string | null;
  updatedAt?: string | null;
}

export interface ApiScenarioDetail extends ApiScenarioItem {
  description?: string | null;
  environmentId?: number | null;
  variableSetId?: number | null;
  variables?: ApiVariableItem[];
  assertions?: ApiAssertionConfig[];
  steps: ApiScenarioStep[];
  createdAt?: string | null;
}

export interface SaveApiScenarioPayload {
  workspaceCode?: string;
  moduleId?: number | null;
  name: string;
  description?: string | null;
  status?: string | null;
  environmentId?: number | null;
  variableSetId?: number | null;
  variables: ApiVariableItem[];
  assertions: ApiAssertionConfig[];
  steps: ApiScenarioStep[];
}

export interface ApiScenarioFormValues {
  moduleId: number | null;
  name: string;
  description: string;
  status: string;
  environmentId: number | null;
  variableSetId: number | null;
  steps: ApiScenarioStep[];
}
