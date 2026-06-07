export interface PageResponse<T> {
  items: T[];
  total: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
}

export interface EnvConfigItem {
  id: number;
  workspaceCode: string;
  workspaceName?: string;
  envType: string;
  envName: string;
  baseUrl: string;
  configJson?: string;
  status: number;
}

export interface SaveEnvConfigPayload {
  workspaceCode?: string;
  envType: string;
  envName: string;
  baseUrl: string;
  configJson?: string;
}

export interface EnvConfigFormValues {
  envType: string;
  envName: string;
  baseUrl: string;
  configJson: string;
  status: number;
}

export interface UpdateSettingStatusPayload {
  status: number;
}

export interface ParamSetItem {
  id: number;
  workspaceCode: string;
  workspaceName?: string;
  paramType: string;
  paramName: string;
  contentJson?: string;
  status: number;
}

export interface SaveParamSetPayload {
  workspaceCode?: string;
  paramType: string;
  paramName: string;
  contentJson?: string;
}

export interface ParamSetFormValues {
  paramType: string;
  paramName: string;
  contentJson: string;
  status: number;
}

export interface DbConnectionItem {
  id: number;
  workspaceCode: string;
  workspaceName?: string;
  connectionName: string;
  dbType: string;
  driverClassName?: string;
  jdbcUrl: string;
  username?: string;
  passwordConfigured: boolean;
  poolMax?: number;
  timeoutMs?: number;
  description?: string;
  status: number;
}

export interface SaveDbConnectionPayload {
  workspaceCode?: string;
  connectionName: string;
  dbType: string;
  driverClassName?: string;
  jdbcUrl: string;
  username?: string;
  password?: string;
  poolMax?: number;
  timeoutMs?: number;
  description?: string;
  status?: number;
}

export interface DbConnectionFormValues {
  connectionName: string;
  dbType: string;
  driverClassName: string;
  jdbcUrl: string;
  username: string;
  password: string;
  poolMax: number;
  timeoutMs: number;
  description: string;
  status: number;
}

export interface TestDbConnectionPayload {
  id?: number | string;
  workspaceCode?: string;
  connectionName?: string;
  dbType?: string;
  driverClassName?: string;
  jdbcUrl?: string;
  username?: string;
  password?: string;
  timeoutMs?: number;
}

export interface DbConnectionTestResult {
  success: boolean;
  message?: string;
}

export type ConfigCenterStatus = 'enabled' | 'disabled' | 'error';

export interface ConfigCenterSummary {
  envTotal: number;
  paramTotal: number;
  dbTotal: number;
  enabledTotal: number;
}
