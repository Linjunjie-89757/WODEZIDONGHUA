import type {
  ApiScenarioDetail,
  ApiScenarioFormValues,
  ApiScenarioStep,
  SaveApiScenarioPayload
} from '../model/types';
import { createDefaultRequestConfig } from './requestConfig';

function stepId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createCustomRequestStep(): ApiScenarioStep {
  return {
    id: stepId('custom'),
    name: 'Custom Request',
    stepType: 'CUSTOM_REQUEST',
    enabled: true,
    resource: '/auth/me',
    resourceId: null,
    resourceType: 'CUSTOM',
    requestConfig: createDefaultRequestConfig(),
    assertions: [],
    preProcessors: [],
    postProcessors: [],
    children: []
  };
}

export function createReferenceDefinitionStep(): ApiScenarioStep {
  return {
    id: stepId('definition'),
    name: 'API Definition Step',
    stepType: 'API',
    enabled: true,
    resourceId: null,
    resourceType: null,
    definitionId: null,
    definitionName: null,
    children: []
  };
}

export function createReferenceCaseStep(): ApiScenarioStep {
  return {
    id: stepId('case'),
    name: 'API Case Step',
    stepType: 'API_CASE',
    enabled: true,
    resourceId: null,
    resourceType: null,
    caseId: null,
    caseName: null,
    children: []
  };
}

export function createGroupStep(): ApiScenarioStep {
  return {
    id: stepId('group'),
    name: 'Step Group',
    stepType: 'CUSTOM_REQUEST',
    enabled: true,
    resource: '/auth/me',
    resourceId: null,
    resourceType: 'CUSTOM',
    requestConfig: createDefaultRequestConfig(),
    children: []
  };
}

export function createDefaultScenarioForm(): ApiScenarioFormValues {
  return {
    moduleId: null,
    name: '',
    description: '',
    status: 'ACTIVE',
    environmentId: null,
    variableSetId: null,
    steps: [createCustomRequestStep()]
  };
}

export function createScenarioEditForm(detail: ApiScenarioDetail): ApiScenarioFormValues {
  return {
    moduleId: detail.moduleId || null,
    name: detail.name,
    description: detail.description || '',
    status: detail.status || 'ACTIVE',
    environmentId: detail.environmentId || null,
    variableSetId: detail.variableSetId || null,
    steps: detail.steps?.length ? normalizeScenarioSteps(detail.steps) : [createCustomRequestStep()]
  };
}

export function normalizeScenarioSteps(steps: ApiScenarioStep[]): ApiScenarioStep[] {
  return steps.map((step) => {
    const base: ApiScenarioStep = {
      ...step,
      id: step.id || stepId(String(step.stepType || 'step').toLowerCase()),
      name: step.name || fallbackStepName(step),
      enabled: step.enabled !== false,
      children: normalizeScenarioSteps(step.children || [])
    };

    if (base.stepType === 'API') {
      const definitionId = base.definitionId || base.resourceId || null;
      return {
        ...base,
        definitionId,
        resourceId: definitionId,
        resourceType: definitionId ? 'DEFINITION' : null,
        caseId: null,
        caseName: null,
        requestConfig: null
      };
    }

    if (base.stepType === 'API_CASE') {
      const caseId = base.caseId || base.resourceId || null;
      return {
        ...base,
        caseId,
        resourceId: caseId,
        resourceType: caseId ? 'CASE' : null,
        definitionId: null,
        definitionName: null,
        requestConfig: null
      };
    }

    if (base.stepType === 'CUSTOM_REQUEST' || base.stepType === 'GROUP') {
      const requestConfig = {
        ...createDefaultRequestConfig(),
        ...(base.requestConfig || {})
      };
      const path = requestConfig.path || base.resource || '/auth/me';
      return {
        ...base,
        resource: path,
        resourceId: null,
        resourceType: 'CUSTOM',
        definitionId: null,
        definitionName: null,
        caseId: null,
        caseName: null,
        requestConfig: {
          ...requestConfig,
          path
        }
      };
    }

    return {
      ...base,
      stepType: 'GROUP',
      resource: null,
      resourceId: null,
      resourceType: null,
      definitionId: null,
      definitionName: null,
      caseId: null,
      caseName: null,
      requestConfig: null
    };
  });
}

function fallbackStepName(step: ApiScenarioStep) {
  const names: Record<string, string> = {
    API: 'API Definition Step',
    API_CASE: 'API Case Step',
    CUSTOM_REQUEST: 'Custom Request',
    GROUP: 'Step Group'
  };

  return names[step.stepType] || 'Scenario Step';
}

export function toSaveScenarioPayload(
  form: ApiScenarioFormValues,
  workspaceCode?: string
): SaveApiScenarioPayload {
  return {
    workspaceCode,
    moduleId: form.moduleId || null,
    name: form.name.trim(),
    description: form.description.trim() || null,
    status: form.status.trim() || null,
    environmentId: form.environmentId || null,
    variableSetId: form.variableSetId || null,
    variables: [],
    assertions: [],
    steps: normalizeScenarioSteps(form.steps)
  };
}
