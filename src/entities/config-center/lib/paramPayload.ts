import type { ParamSetFormValues, ParamSetItem, SaveParamSetPayload } from '../model/types';

export function createDefaultParamSetForm(): ParamSetFormValues {
  return {
    paramType: 'HEADER',
    paramName: '',
    contentJson: '',
    status: 1
  };
}

export function createParamSetEditForm(param: ParamSetItem): ParamSetFormValues {
  return {
    paramType: param.paramType,
    paramName: param.paramName,
    contentJson: param.contentJson || '',
    status: param.status
  };
}

export function toSaveParamSetPayload(
  form: ParamSetFormValues,
  workspaceCode?: string
): SaveParamSetPayload {
  const contentJson = form.contentJson.trim();

  return {
    ...(workspaceCode ? { workspaceCode } : {}),
    paramType: form.paramType.trim(),
    paramName: form.paramName.trim(),
    ...(contentJson ? { contentJson } : {})
  };
}
