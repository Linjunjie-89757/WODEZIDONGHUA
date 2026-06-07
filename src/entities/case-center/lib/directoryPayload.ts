import type {
  CaseDirectoryFormValues,
  MoveCaseDirectoryPayload,
  RenameCaseDirectoryPayload,
  SaveCaseDirectoryPayload
} from '../model/types';

export function createDefaultCaseDirectoryForm(): CaseDirectoryFormValues {
  return {
    name: ''
  };
}

export function createCaseDirectoryEditForm(name: string): CaseDirectoryFormValues {
  return {
    name
  };
}

export function toSaveCaseDirectoryPayload(
  form: CaseDirectoryFormValues,
  workspaceCode?: string,
  parentId?: number | null
): SaveCaseDirectoryPayload {
  return {
    ...(workspaceCode ? { workspaceCode } : {}),
    parentId,
    name: form.name.trim()
  };
}

export function toRenameCaseDirectoryPayload(
  form: CaseDirectoryFormValues
): RenameCaseDirectoryPayload {
  return {
    name: form.name.trim()
  };
}

export function toMoveCaseDirectoryPayload(
  targetParentId?: number | null
): MoveCaseDirectoryPayload {
  return {
    targetParentId
  };
}
