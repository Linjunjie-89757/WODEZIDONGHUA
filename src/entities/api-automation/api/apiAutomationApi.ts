import { endpoints } from '@shared/api/endpoints';
import { request, withWorkspace } from '@shared/api/request';

import type {
  ApiDefinitionCaseChangeHistoryItem,
  ApiDefinitionCaseDetail,
  ApiDefinitionCaseItem,
  ApiDefinitionCaseRunHistoryDetail,
  ApiDefinitionCaseRunHistoryItem,
  ApiDefinitionDetail,
  ApiDefinitionItem,
  ApiDefinitionModuleItem,
  ApiEnvironmentItem,
  ApiRunPayload,
  ApiRunResponse,
  ApiRunStepResult,
  ApiScenarioDetail,
  ApiScenarioItem,
  ApiScenarioModuleItem,
  ApiVariableSetItem,
  PageResponse,
  SaveApiDefinitionCasePayload,
  SaveApiDefinitionPayload,
  SaveApiScenarioPayload
} from '../model/types';

function normalizePage<T>(page: PageResponse<T> | T[] | undefined): PageResponse<T> {
  if (Array.isArray(page)) {
    return {
      items: page,
      total: page.length,
      pageNo: 1,
      pageSize: page.length,
      totalPages: page.length ? 1 : 0
    };
  }

  return {
    items: page?.items || [],
    total: page?.total || 0,
    pageNo: page?.pageNo || 1,
    pageSize: page?.pageSize || page?.items?.length || 0,
    totalPages: page?.totalPages || 0
  };
}

export const apiAutomationApi = {
  async listDefinitions(workspaceCode?: string) {
    const page = await request.get<unknown, PageResponse<ApiDefinitionItem>>(
      endpoints.apiAutomation.definitions,
      withWorkspace(workspaceCode)
    );
    return normalizePage(page);
  },
  getDefinitionDetail(id: number | string, workspaceCode?: string) {
    return request.get<unknown, ApiDefinitionDetail>(
      endpoints.apiAutomation.definitionDetail(id),
      withWorkspace(workspaceCode)
    );
  },
  createDefinition(payload: SaveApiDefinitionPayload, workspaceCode?: string) {
    return request.post<unknown, ApiDefinitionDetail>(
      endpoints.apiAutomation.createDefinition,
      payload,
      withWorkspace(workspaceCode)
    );
  },
  updateDefinition(
    id: number | string,
    payload: SaveApiDefinitionPayload,
    workspaceCode?: string
  ) {
    return request.put<unknown, ApiDefinitionDetail>(
      endpoints.apiAutomation.updateDefinition(id),
      payload,
      withWorkspace(workspaceCode)
    );
  },
  deleteDefinition(id: number | string, workspaceCode?: string) {
    return request.delete(endpoints.apiAutomation.deleteDefinition(id), withWorkspace(workspaceCode));
  },
  listDefinitionModules(workspaceCode?: string) {
    return request.get<unknown, ApiDefinitionModuleItem[]>(
      endpoints.apiAutomation.definitionModules,
      withWorkspace(workspaceCode)
    );
  },
  async listEnvironments(workspaceCode?: string) {
    const page = await request.get<unknown, PageResponse<ApiEnvironmentItem>>(
      endpoints.apiAutomation.environments,
      withWorkspace(workspaceCode)
    );
    return normalizePage(page);
  },
  async listVariableSets(workspaceCode?: string) {
    const page = await request.get<unknown, PageResponse<ApiVariableSetItem>>(
      endpoints.apiAutomation.variableSets,
      withWorkspace(workspaceCode)
    );
    return normalizePage(page);
  },
  debugDefinition(id: number | string, payload: ApiRunPayload, workspaceCode?: string) {
    return request.post<unknown, ApiRunResponse>(
      endpoints.apiAutomation.debugDefinition(id),
      payload,
      withWorkspace(workspaceCode)
    );
  },
  async listCases(
    params: { definitionId?: number | string | null; keyword?: string } = {},
    workspaceCode?: string
  ) {
    const page = await request.get<unknown, PageResponse<ApiDefinitionCaseItem>>(
      endpoints.apiAutomation.cases,
      {
        ...withWorkspace(workspaceCode),
        params: {
          definitionId: params.definitionId || undefined,
          keyword: params.keyword || undefined
        }
      }
    );
    return normalizePage(page);
  },
  getCaseDetail(id: number | string, workspaceCode?: string) {
    return request.get<unknown, ApiDefinitionCaseDetail>(
      endpoints.apiAutomation.caseDetail(id),
      withWorkspace(workspaceCode)
    );
  },
  createCase(payload: SaveApiDefinitionCasePayload, workspaceCode?: string) {
    return request.post<unknown, ApiDefinitionCaseDetail>(
      endpoints.apiAutomation.createCase,
      payload,
      withWorkspace(workspaceCode)
    );
  },
  updateCase(id: number | string, payload: SaveApiDefinitionCasePayload, workspaceCode?: string) {
    return request.put<unknown, ApiDefinitionCaseDetail>(
      endpoints.apiAutomation.updateCase(id),
      payload,
      withWorkspace(workspaceCode)
    );
  },
  deleteCase(id: number | string, workspaceCode?: string) {
    return request.delete(endpoints.apiAutomation.deleteCase(id), withWorkspace(workspaceCode));
  },
  runCase(id: number | string, payload: ApiRunPayload, workspaceCode?: string) {
    return request.post<unknown, ApiRunResponse>(
      endpoints.apiAutomation.runCase(id),
      payload,
      withWorkspace(workspaceCode)
    );
  },
  async listCaseRunHistory(id: number | string, workspaceCode?: string) {
    const page = await request.get<unknown, PageResponse<ApiDefinitionCaseRunHistoryItem>>(
      endpoints.apiAutomation.caseRunHistory(id),
      withWorkspace(workspaceCode)
    );
    return normalizePage(page);
  },
  getCaseRunHistoryDetail(historyId: number | string, workspaceCode?: string) {
    return request.get<unknown, ApiDefinitionCaseRunHistoryDetail>(
      endpoints.apiAutomation.caseRunHistoryDetail(historyId),
      withWorkspace(workspaceCode)
    );
  },
  async listCaseChangeHistory(id: number | string, workspaceCode?: string) {
    const page = await request.get<unknown, PageResponse<ApiDefinitionCaseChangeHistoryItem>>(
      endpoints.apiAutomation.caseChangeHistory(id),
      withWorkspace(workspaceCode)
    );
    return normalizePage(page);
  },
  async listScenarios(
    params: { moduleId?: number | string | null; keyword?: string; status?: string } = {},
    workspaceCode?: string
  ) {
    const page = await request.get<unknown, PageResponse<ApiScenarioItem>>(
      endpoints.apiAutomation.scenarios,
      {
        ...withWorkspace(workspaceCode),
        params: {
          moduleId: params.moduleId || undefined,
          keyword: params.keyword || undefined,
          status: params.status || undefined
        }
      }
    );
    return normalizePage(page);
  },
  listScenarioModules(workspaceCode?: string) {
    return request.get<unknown, ApiScenarioModuleItem[]>(
      endpoints.apiAutomation.scenarioModules,
      withWorkspace(workspaceCode)
    );
  },
  getScenarioDetail(id: number | string, workspaceCode?: string) {
    return request.get<unknown, ApiScenarioDetail>(
      endpoints.apiAutomation.scenarioDetail(id),
      withWorkspace(workspaceCode)
    );
  },
  createScenario(payload: SaveApiScenarioPayload, workspaceCode?: string) {
    return request.post<unknown, ApiScenarioDetail>(
      endpoints.apiAutomation.createScenario,
      payload,
      withWorkspace(workspaceCode)
    );
  },
  updateScenario(id: number | string, payload: SaveApiScenarioPayload, workspaceCode?: string) {
    return request.put<unknown, ApiScenarioDetail>(
      endpoints.apiAutomation.updateScenario(id),
      payload,
      withWorkspace(workspaceCode)
    );
  },
  deleteScenario(id: number | string, workspaceCode?: string) {
    return request.delete(endpoints.apiAutomation.deleteScenario(id), withWorkspace(workspaceCode));
  },
  runScenario(id: number | string, payload: ApiRunPayload, workspaceCode?: string) {
    return request.post<unknown, ApiRunResponse>(
      endpoints.apiAutomation.runScenario(id),
      payload,
      withWorkspace(workspaceCode)
    );
  },
  listReportSteps(reportId: number | string, workspaceCode?: string) {
    return request.get<unknown, ApiRunStepResult[]>(
      endpoints.apiAutomation.reportSteps(reportId),
      withWorkspace(workspaceCode)
    );
  }
};
