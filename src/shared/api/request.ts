import axios, { AxiosError } from 'axios';

import { appEnv } from '@shared/config/env';

export const WORKSPACE_HEADER = 'X-Workspace-Code';

export const request = axios.create({
  baseURL: appEnv.apiBaseUrl,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    [WORKSPACE_HEADER]: 'ALL'
  }
});

request.interceptors.request.use((config) => {
  if (!config.headers.get?.(WORKSPACE_HEADER) && !config.headers[WORKSPACE_HEADER]) {
    config.headers[WORKSPACE_HEADER] = 'ALL';
  }

  return config;
});

request.interceptors.response.use(
  (response) => {
    const payload = response.data;

    if (payload && typeof payload === 'object' && 'success' in payload) {
      if (!payload.success) {
        return Promise.reject(new Error(payload.message || 'Request failed'));
      }

      return payload.data;
    }

    return payload;
  },
  (error: AxiosError) => Promise.reject(error)
);

export function withWorkspace(workspaceCode?: string) {
  return {
    headers: {
      [WORKSPACE_HEADER]: workspaceCode || 'ALL'
    }
  };
}
