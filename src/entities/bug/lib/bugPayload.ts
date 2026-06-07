import type { BugDetail, BugFormValues, BugSummary, SaveBugPayload } from '../model/types';

export function createDefaultBugForm(): BugFormValues {
  return {
    title: '',
    description: '',
    priority: 'P1',
    severity: 'HIGH',
    assigneeId: null,
    relatedCaseId: null,
    tagsText: ''
  };
}

export function createBugEditForm(bug: BugSummary | BugDetail): BugFormValues {
  return {
    title: bug.title,
    description: 'description' in bug ? bug.description : '',
    priority: bug.priority,
    severity: bug.severity,
    assigneeId: 'assigneeId' in bug ? bug.assigneeId || null : null,
    relatedCaseId: bug.relatedCaseId || null,
    tagsText: bug.tags.join(', ')
  };
}

export function toSaveBugPayload(
  form: BugFormValues,
  workspaceCode?: string
): SaveBugPayload | null {
  if (!form.assigneeId) {
    return null;
  }

  const tags = form.tagsText
    .split(/[,\n，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    ...(workspaceCode ? { workspaceCode } : {}),
    title: form.title.trim(),
    description: form.description.trim(),
    priority: form.priority,
    severity: form.severity,
    assigneeId: form.assigneeId,
    relatedCaseId: form.relatedCaseId,
    tags
  };
}
