import type { EnvConfigFormValues, EnvConfigItem, SaveEnvConfigPayload } from '../model/types';

export function createDefaultEnvConfigForm(): EnvConfigFormValues {
  return {
    envType: 'API',
    envName: '',
    baseUrl: '',
    configJson: '',
    status: 1
  };
}

export function createEnvConfigEditForm(env: EnvConfigItem): EnvConfigFormValues {
  return {
    envType: env.envType,
    envName: env.envName,
    baseUrl: env.baseUrl,
    configJson: env.configJson || '',
    status: env.status
  };
}

export function toSaveEnvConfigPayload(
  form: EnvConfigFormValues,
  workspaceCode?: string
): SaveEnvConfigPayload {
  const configJson = form.configJson.trim();

  return {
    ...(workspaceCode ? { workspaceCode } : {}),
    envType: form.envType.trim(),
    envName: form.envName.trim(),
    baseUrl: form.baseUrl.trim(),
    ...(configJson ? { configJson } : {})
  };
}
