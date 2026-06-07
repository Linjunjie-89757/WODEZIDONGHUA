import type { CaseDetail, CaseFormValues, CaseSummaryItem, SaveCasePayload } from '../model/types';

export function createDefaultCaseForm(): CaseFormValues {
  return {
    directoryId: null,
    title: '',
    caseType: 'FUNCTION',
    priority: 'P1',
    sourceType: 'MANUAL',
    caseStatus: 'ACTIVE',
    ownerId: null,
    precondition: '',
    steps: '',
    expectedResult: ''
  };
}

export function createCaseEditForm(caseItem: CaseSummaryItem | CaseDetail): CaseFormValues {
  return {
    directoryId: caseItem.directoryId || null,
    title: caseItem.title,
    caseType: caseItem.caseType,
    priority: caseItem.priority,
    sourceType: caseItem.sourceType,
    caseStatus: caseItem.status,
    ownerId: 'ownerId' in caseItem ? caseItem.ownerId || null : null,
    precondition: 'precondition' in caseItem ? caseItem.precondition || '' : '',
    steps: 'steps' in caseItem ? caseItem.steps || '' : '',
    expectedResult: 'expectedResult' in caseItem ? caseItem.expectedResult || '' : ''
  };
}

export function toSaveCasePayload(
  form: CaseFormValues,
  workspaceCode?: string
): SaveCasePayload {
  const precondition = form.precondition.trim();
  const steps = form.steps.trim();
  const expectedResult = form.expectedResult.trim();

  return {
    ...(workspaceCode ? { workspaceCode } : {}),
    directoryId: form.directoryId,
    title: form.title.trim(),
    caseType: form.caseType.trim(),
    priority: form.priority.trim(),
    sourceType: form.sourceType.trim(),
    caseStatus: form.caseStatus.trim(),
    ownerId: form.ownerId,
    ...(precondition ? { precondition } : {}),
    ...(steps ? { steps } : {}),
    ...(expectedResult ? { expectedResult } : {})
  };
}
