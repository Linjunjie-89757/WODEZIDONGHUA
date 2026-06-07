import type { PageResponse } from '@entities/case-center';

export type BugPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type BugSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type BugStatus =
  | 'TODO'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'PENDING_VERIFY'
  | 'CLOSED'
  | 'REJECTED';
export type BugSourceType = 'MANUAL' | 'CASE' | 'REPORT';
export type BugActivityType =
  | 'CREATED'
  | 'ASSIGNED'
  | 'STATUS_CHANGED'
  | 'COMMENT_ADDED'
  | 'ATTACHMENT_ADDED'
  | 'ATTACHMENT_REMOVED'
  | 'RELATION_UPDATED';

export interface BugStatistics {
  total: number;
  todo: number;
  assigned: number;
  inProgress: number;
  pendingVerify: number;
  closed: number;
  rejected: number;
}

export interface BugSummary {
  id: number;
  bugNo: string;
  title: string;
  tags: string[];
  priority: BugPriority;
  severity: BugSeverity;
  status: BugStatus;
  assigneeName?: string | null;
  reporterName: string;
  createdAt?: string | null;
  updatedByName?: string | null;
  updatedAt?: string | null;
  relatedCaseId?: number | null;
  relatedCaseCount: number;
  workspaceCode: string;
  workspaceName: string;
}

export interface BugAttachment {
  id: number;
  fileName: string;
  contentType?: string | null;
  fileSize?: number | null;
  downloadUrl?: string | null;
  uploadedByName?: string | null;
  createdAt?: string | null;
}

export interface BugComment {
  id: number;
  content: string;
  commenterId: number;
  commenterName: string;
  createdAt: string;
}

export interface BugFlow {
  id: number;
  fromStatus?: BugStatus | null;
  toStatus: BugStatus;
  operatorId: number;
  operatorName: string;
  actionComment?: string | null;
  createdAt: string;
}

export interface BugCaseSummary {
  id: number;
  caseNo: string;
  title: string;
  workspaceCode: string;
  workspaceName: string;
  directoryId?: number | null;
  directoryName?: string | null;
  modulePath?: string | null;
  executionStatus?: string | null;
  executionComment?: string | null;
  executedAt?: string | null;
}

export interface BugReportSummary {
  id: number;
  reportName: string;
  result: string;
  failureSummary?: string | null;
  taskId?: number | null;
  taskName?: string | null;
  workspaceCode: string;
  workspaceName: string;
}

export interface BugTaskSummary {
  id: number;
  taskName: string;
  engineType: string;
  status: string;
  workspaceCode: string;
  workspaceName: string;
}

export interface BugSourceContext {
  sourceType: BugSourceType;
  caseSummary?: BugCaseSummary | null;
  reportSummary?: BugReportSummary | null;
  taskSummary?: BugTaskSummary | null;
}

export interface BugActivity {
  id: string;
  type: BugActivityType;
  operatorId?: number | null;
  operatorName?: string | null;
  occurredAt?: string | null;
  title: string;
  content?: string | null;
  fromStatus?: BugStatus | null;
  toStatus?: BugStatus | null;
  attachmentId?: number | null;
  attachmentName?: string | null;
  commentId?: number | null;
}

export interface BugDetail extends BugSummary {
  description: string;
  sourceType: BugSourceType;
  assigneeId?: number | null;
  reporterId: number;
  relatedReportId?: number | null;
  relatedTaskId?: number | null;
  attachments: BugAttachment[];
  sourceContext: BugSourceContext;
  activities: BugActivity[];
  flows: BugFlow[];
  comments: BugComment[];
}

export type BugPage = PageResponse<BugSummary>;

export interface BugFormValues {
  title: string;
  description: string;
  priority: BugPriority;
  severity: BugSeverity;
  assigneeId: number | null;
  relatedCaseId: number | null;
  tagsText: string;
}

export interface SaveBugPayload {
  workspaceCode?: string;
  title: string;
  description: string;
  priority: BugPriority;
  severity: BugSeverity;
  assigneeId: number;
  relatedCaseId?: number | null;
  tags: string[];
}

export interface TransitionBugPayload {
  workspaceCode?: string;
  toStatus: BugStatus;
  actionComment?: string;
}

export interface AddBugCommentPayload {
  workspaceCode?: string;
  content: string;
}
