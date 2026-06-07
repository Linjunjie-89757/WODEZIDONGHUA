export const endpoints = {
  auth: {
    login: '/auth/login',
    me: '/auth/me',
    logout: '/auth/logout'
  },
  user: {
    list: '/users'
  },
  workspace: {
    list: '/workspaces',
    switchable: '/workspaces/switchable',
    detail: (workspaceCode: string) => `/workspaces/${workspaceCode}`,
    members: (workspaceCode: string) => `/workspaces/${workspaceCode}/members`,
    member: (workspaceCode: string, memberId: number | string) =>
      `/workspaces/${workspaceCode}/members/${memberId}`,
    batchMembers: (workspaceCode: string) => `/workspaces/${workspaceCode}/members/batch`
  },
  aiModel: {
    connections: '/cases/ai/providers',
    createConnection: '/cases/ai/providers',
    previewModels: '/cases/ai/providers/preview-models',
    updateConnection: (id: number | string) => `/cases/ai/providers/${id}`,
    deleteConnection: (id: number | string) => `/cases/ai/providers/${id}`,
    testConnection: (id: number | string) => `/cases/ai/providers/${id}/test`,
    fetchModels: (id: number | string) => `/cases/ai/providers/${id}/fetch-models`,
    models: (id: number | string) => `/cases/ai/providers/${id}/models`,
    secret: (id: number | string) => `/cases/ai/providers/${id}/secret`,
    probeModel: (id: number | string) => `/cases/ai/providers/${id}/models/probe`
  },
  configCenter: {
    envs: '/settings/envs',
    createEnv: '/settings/envs',
    updateEnv: (id: number | string) => `/settings/envs/${id}`,
    updateEnvStatus: (id: number | string) => `/settings/envs/${id}/status`,
    deleteEnv: (id: number | string) => `/settings/envs/${id}`,
    params: '/settings/params',
    createParam: '/settings/params',
    updateParam: (id: number | string) => `/settings/params/${id}`,
    updateParamStatus: (id: number | string) => `/settings/params/${id}/status`,
    deleteParam: (id: number | string) => `/settings/params/${id}`,
    dbConnections: '/settings/db-connections',
    createDbConnection: '/settings/db-connections',
    updateDbConnection: (id: number | string) => `/settings/db-connections/${id}`,
    updateDbConnectionStatus: (id: number | string) =>
      `/settings/db-connections/${id}/status`,
    deleteDbConnection: (id: number | string) => `/settings/db-connections/${id}`,
    testDbConnection: '/settings/db-connections/test'
  },
  caseCenter: {
    cases: '/cases',
    createCase: '/cases',
    detail: (id: number | string) => `/cases/${id}`,
    updateCase: (id: number | string) => `/cases/${id}`,
    deleteCase: (id: number | string) => `/cases/${id}`,
    directories: '/cases/directories',
    createDirectory: '/cases/directories',
    renameDirectory: (id: number | string) => `/cases/directories/${id}`,
    moveDirectory: (id: number | string) => `/cases/directories/${id}/move`,
    deleteDirectory: (id: number | string) => `/cases/directories/${id}`
  },
  bug: {
    statistics: '/bugs/statistics',
    list: '/bugs',
    detail: (id: number | string) => `/bugs/${id}`,
    create: '/bugs',
    update: (id: number | string) => `/bugs/${id}`,
    assign: (id: number | string) => `/bugs/${id}/assign`,
    transition: (id: number | string) => `/bugs/${id}/transition`,
    comments: (id: number | string) => `/bugs/${id}/comments`,
    addComment: (id: number | string) => `/bugs/${id}/comments`,
    attachments: (id: number | string) => `/bugs/${id}/attachments`,
    deleteAttachment: (id: number | string, attachmentId: number | string) =>
      `/bugs/${id}/attachments/${attachmentId}`,
    downloadAttachment: (id: number | string, attachmentId: number | string) =>
      `/bugs/${id}/attachments/${attachmentId}/download`,
    createFromCase: (caseId: number | string) => `/cases/${caseId}/bugs`,
    createFromReport: (reportId: number | string) => `/reports/${reportId}/bugs`
  },
  apiAutomation: {
    definitions: '/automation/api/definitions',
    definitionDetail: (id: number | string) => `/automation/api/definitions/${id}`,
    createDefinition: '/automation/api/definitions',
    updateDefinition: (id: number | string) => `/automation/api/definitions/${id}`,
    deleteDefinition: (id: number | string) => `/automation/api/definitions/${id}`,
    debugDefinition: (id: number | string) =>
      `/automation/api/definitions/${id}/debug-run`,
    debugDefinitionDraft: '/automation/api/definitions/debug-run',
    definitionModules: '/automation/api/definition-modules',
    createDefinitionModule: '/automation/api/definition-modules',
    updateDefinitionModule: (id: number | string) =>
      `/automation/api/definition-modules/${id}`,
    moveDefinitionModule: (id: number | string) =>
      `/automation/api/definition-modules/${id}/move`,
    deleteDefinitionModule: (id: number | string) =>
      `/automation/api/definition-modules/${id}`,
    cases: '/automation/api/cases',
    caseDetail: (id: number | string) => `/automation/api/cases/${id}`,
    createCase: '/automation/api/cases',
    updateCase: (id: number | string) => `/automation/api/cases/${id}`,
    deleteCase: (id: number | string) => `/automation/api/cases/${id}`,
    runCase: (id: number | string) => `/automation/api/cases/${id}/run`,
    debugCaseDraft: '/automation/api/cases/debug-run',
    caseRunHistory: (id: number | string) =>
      `/automation/api/cases/${id}/run-history`,
    caseRunHistoryDetail: (historyId: number | string) =>
      `/automation/api/cases/run-history/${historyId}`,
    caseChangeHistory: (id: number | string) =>
      `/automation/api/cases/${id}/change-history`,
    streamAiCaseGeneration: '/automation/api/ai-case-generation/stream',
    scenarios: '/automation/api/scenarios',
    scenarioDetail: (id: number | string) => `/automation/api/scenarios/${id}`,
    createScenario: '/automation/api/scenarios',
    updateScenario: (id: number | string) => `/automation/api/scenarios/${id}`,
    deleteScenario: (id: number | string) => `/automation/api/scenarios/${id}`,
    runScenario: (id: number | string) => `/automation/api/scenarios/${id}/run`,
    scenarioModules: '/automation/api/scenario-modules',
    createScenarioModule: '/automation/api/scenario-modules',
    updateScenarioModule: (id: number | string) =>
      `/automation/api/scenario-modules/${id}`,
    moveScenarioModule: (id: number | string) =>
      `/automation/api/scenario-modules/${id}/move`,
    deleteScenarioModule: (id: number | string) =>
      `/automation/api/scenario-modules/${id}`,
    environments: '/automation/api/environments',
    createEnvironment: '/automation/api/environments',
    updateEnvironment: (id: number | string) =>
      `/automation/api/environments/${id}`,
    deleteEnvironment: (id: number | string) =>
      `/automation/api/environments/${id}`,
    variableSets: '/automation/api/variable-sets',
    createVariableSet: '/automation/api/variable-sets',
    updateVariableSet: (id: number | string) =>
      `/automation/api/variable-sets/${id}`,
    deleteVariableSet: (id: number | string) =>
      `/automation/api/variable-sets/${id}`,
    reportSteps: (reportId: number | string) =>
      `/automation/api/runs/reports/${reportId}/steps`
  }
} as const;
