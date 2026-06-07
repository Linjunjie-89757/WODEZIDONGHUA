import { endpoints } from '@shared/api/endpoints';
import { request, withWorkspace } from '@shared/api/request';

import type {
  CaseDirectoryWorkspace,
  CaseDirectoryNode,
  CaseDetail,
  CaseListQuery,
  CaseSummaryItem,
  MoveCaseDirectoryPayload,
  PageResponse,
  RenameCaseDirectoryPayload,
  SaveCaseDirectoryPayload,
  SaveCasePayload
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

function buildCaseListPath(query?: CaseListQuery) {
  const search = new URLSearchParams();

  if (query?.pageNo) {
    search.set('pageNo', String(query.pageNo));
  }

  if (query?.pageSize) {
    search.set('pageSize', String(query.pageSize));
  }

  if (query?.directoryId !== undefined && query.directoryId !== null) {
    search.set('directoryId', String(query.directoryId));
  }

  const serialized = search.toString();
  return serialized ? `${endpoints.caseCenter.cases}?${serialized}` : endpoints.caseCenter.cases;
}

export const caseCenterApi = {
  async listCases(workspaceCode?: string, query?: CaseListQuery) {
    const page = await request.get<unknown, PageResponse<CaseSummaryItem>>(
      buildCaseListPath(query),
      withWorkspace(workspaceCode)
    );
    return normalizePage(page);
  },
  listDirectories(workspaceCode?: string) {
    return request.get<unknown, CaseDirectoryWorkspace[]>(
      endpoints.caseCenter.directories,
      withWorkspace(workspaceCode)
    );
  },
  createDirectory(payload: SaveCaseDirectoryPayload, workspaceCode?: string) {
    return request.post<unknown, CaseDirectoryNode>(
      endpoints.caseCenter.createDirectory,
      payload,
      withWorkspace(workspaceCode)
    );
  },
  renameDirectory(id: number | string, payload: RenameCaseDirectoryPayload, workspaceCode?: string) {
    return request.put<unknown, CaseDirectoryNode>(
      endpoints.caseCenter.renameDirectory(id),
      payload,
      withWorkspace(workspaceCode)
    );
  },
  moveDirectory(id: number | string, payload: MoveCaseDirectoryPayload, workspaceCode?: string) {
    return request.post<unknown, CaseDirectoryNode>(
      endpoints.caseCenter.moveDirectory(id),
      payload,
      withWorkspace(workspaceCode)
    );
  },
  deleteDirectory(id: number | string, workspaceCode?: string) {
    return request.delete(endpoints.caseCenter.deleteDirectory(id), withWorkspace(workspaceCode));
  },
  getCaseDetail(id: number | string, workspaceCode?: string) {
    return request.get<unknown, CaseDetail>(
      endpoints.caseCenter.detail(id),
      withWorkspace(workspaceCode)
    );
  },
  createCase(payload: SaveCasePayload, workspaceCode?: string) {
    return request.post<unknown, CaseSummaryItem>(
      endpoints.caseCenter.createCase,
      payload,
      withWorkspace(workspaceCode)
    );
  },
  updateCase(id: number | string, payload: SaveCasePayload, workspaceCode?: string) {
    return request.put<unknown, CaseSummaryItem>(
      endpoints.caseCenter.updateCase(id),
      payload,
      withWorkspace(workspaceCode)
    );
  },
  deleteCase(id: number | string, workspaceCode?: string) {
    return request.delete(endpoints.caseCenter.deleteCase(id), withWorkspace(workspaceCode));
  }
};
