export interface PageResponse<T> {
  items: T[];
  total: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
}

export interface CaseSummaryItem {
  id: number;
  caseNo: string;
  title: string;
  caseType: string;
  priority: string;
  sourceType: string;
  status: string;
  executionStatus: string;
  ownerName?: string;
  executorName?: string;
  executionComment?: string;
  executedAt?: string;
  workspaceCode: string;
  workspaceName?: string;
  directoryId?: number | null;
  directoryName?: string | null;
  createdBy?: number | null;
  createdByName?: string | null;
  createdAt?: string | null;
  updatedBy?: number | null;
  updatedByName?: string | null;
  updatedAt?: string | null;
  reviewStatus: string;
  reviewComment?: string | null;
  reviewedBy?: number | null;
  reviewedByName?: string | null;
  reviewedAt?: string | null;
}

export interface CaseExecutionAttachment {
  id: number;
  fileName: string;
  contentType?: string | null;
  fileSize?: number | null;
  downloadUrl?: string | null;
  createdAt?: string | null;
}

export interface CaseDetail extends CaseSummaryItem {
  ownerId?: number | null;
  executorId?: number | null;
  executionNote?: string | null;
  precondition?: string;
  steps?: string;
  expectedResult?: string;
  attachments: CaseExecutionAttachment[];
}

export interface CaseDirectoryNode {
  id: number;
  name: string;
  workspaceCode: string;
  workspaceName?: string;
  parentId?: number | null;
  children: CaseDirectoryNode[];
}

export interface CaseDirectoryWorkspace {
  workspaceCode: string;
  workspaceName: string;
  children: CaseDirectoryNode[];
}

export interface SaveCaseDirectoryPayload {
  workspaceCode?: string;
  parentId?: number | null;
  name: string;
}

export interface RenameCaseDirectoryPayload {
  name: string;
}

export interface MoveCaseDirectoryPayload {
  targetParentId?: number | null;
}

export interface CaseDirectoryFormValues {
  name: string;
}

export interface CaseListQuery {
  pageNo?: number;
  pageSize?: number;
  directoryId?: number | null;
}

export interface SaveCasePayload {
  workspaceCode?: string;
  directoryId?: number | null;
  title: string;
  caseType: string;
  priority: string;
  sourceType: string;
  caseStatus: string;
  ownerId?: number | null;
  precondition?: string;
  steps?: string;
  expectedResult?: string;
}

export interface CaseFormValues {
  directoryId: number | null;
  title: string;
  caseType: string;
  priority: string;
  sourceType: string;
  caseStatus: string;
  ownerId: number | null;
  precondition: string;
  steps: string;
  expectedResult: string;
}

export interface CaseCenterSummary {
  caseTotal: number;
  directoryTotal: number;
  reviewedTotal: number;
  executedTotal: number;
}
