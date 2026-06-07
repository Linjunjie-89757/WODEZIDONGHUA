export const appEnv = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  devAuthBypass: import.meta.env.DEV && import.meta.env.VITE_DEV_AUTH_BYPASS === 'true'
} as const;
