import { endpoints } from '@shared/api/endpoints';
import { appEnv } from '@shared/config/env';
import { request, WORKSPACE_HEADER, withWorkspace } from '@shared/api/request';

import type {
  AddBugCommentPayload,
  BugComment,
  BugDetail,
  BugPage,
  BugStatistics,
  SaveBugPayload,
  TransitionBugPayload
} from '../model/types';

function normalizeBugPage(page: BugPage | undefined): BugPage {
  return {
    items: page?.items || [],
    total: page?.total || 0,
    pageNo: page?.pageNo || 1,
    pageSize: page?.pageSize || page?.items?.length || 0,
    totalPages: page?.totalPages || 0
  };
}

export const bugApi = {
  getStatistics(workspaceCode?: string) {
    return request.get<unknown, BugStatistics>(
      endpoints.bug.statistics,
      withWorkspace(workspaceCode)
    );
  },
  async listBugs(workspaceCode?: string) {
    const page = await request.get<unknown, BugPage>(endpoints.bug.list, withWorkspace(workspaceCode));
    return normalizeBugPage(page);
  },
  getBugDetail(id: number | string, workspaceCode?: string) {
    return request.get<unknown, BugDetail>(endpoints.bug.detail(id), withWorkspace(workspaceCode));
  },
  createBug(payload: SaveBugPayload, workspaceCode?: string) {
    return request.post<unknown, BugDetail>(
      endpoints.bug.create,
      payload,
      withWorkspace(workspaceCode)
    );
  },
  updateBug(id: number | string, payload: SaveBugPayload, workspaceCode?: string) {
    return request.put<unknown, BugDetail>(
      endpoints.bug.update(id),
      payload,
      withWorkspace(workspaceCode)
    );
  },
  transitionBug(id: number | string, payload: TransitionBugPayload, workspaceCode?: string) {
    return request.post<unknown, BugDetail>(
      endpoints.bug.transition(id),
      payload,
      withWorkspace(workspaceCode)
    );
  },
  addComment(id: number | string, payload: AddBugCommentPayload, workspaceCode?: string) {
    return request.post<unknown, BugComment>(
      endpoints.bug.addComment(id),
      payload,
      withWorkspace(workspaceCode)
    );
  },
  uploadAttachments(id: number | string, files: File[], workspaceCode?: string) {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    return request.post<unknown, BugAttachment[]>(
      endpoints.bug.attachments(id),
      formData,
      {
        headers: {
          [WORKSPACE_HEADER]: workspaceCode || 'ALL',
          'Content-Type': undefined
        }
      }
    );
  },
  deleteAttachment(id: number | string, attachmentId: number | string, workspaceCode?: string) {
    return request.delete(
      endpoints.bug.deleteAttachment(id, attachmentId),
      withWorkspace(workspaceCode)
    );
  },
  async downloadAttachment(
    id: number | string,
    attachmentId: number | string,
    fileName: string,
    workspaceCode?: string
  ) {
    const response = await fetch(
      `${appEnv.apiBaseUrl}${endpoints.bug.downloadAttachment(id, attachmentId)}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          [WORKSPACE_HEADER]: workspaceCode || 'ALL'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};
