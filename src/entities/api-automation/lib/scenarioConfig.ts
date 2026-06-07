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

export function createWaitStep(): ApiScenarioStep {
  return {
    id: stepId('wait'),
    name: 'Constant Timer',
    stepName: 'Constant Timer',
    stepType: 'CONSTANT_TIMER',
    enabled: true,
    resourceId: null,
    resourceType: null,
    requestConfig: null,
    delayMs: 1000,
    children: []
  };
}

export function createScriptStep(): ApiScenarioStep {
  return {
    id: stepId('script'),
    name: 'Script',
    stepName: 'Script',
    stepType: 'SCRIPT',
    enabled: true,
    resourceId: null,
    resourceType: null,
    requestConfig: null,
    script: 'log("Script executed");',
    assertions: [],
    preProcessors: [],
    postProcessors: [],
    children: []
  };
}

export function createOnceOnlyStep(): ApiScenarioStep {
  return {
    id: stepId('once'),
    name: 'Once-only Controller',
    stepName: 'Once-only Controller',
    stepType: 'ONCE_ONLY_CONTROLLER',
    enabled: true,
    resourceId: null,
    resourceType: null,
    requestConfig: null,
    assertions: [],
    preProcessors: [],
    postProcessors: [],
    children: []
  };
}

export function createIfControllerStep(): ApiScenarioStep {
  return {
    id: stepId('if'),
    name: 'If Controller',
    stepName: 'If Controller',
    stepType: 'IF_CONTROLLER',
    enabled: true,
    resourceId: null,
    resourceType: null,
    requestConfig: null,
    conditionType: 'EXPRESSION',
    conditionExpression: 'true',
    assertions: [],
    preProcessors: [],
    postProcessors: [],
    children: []
  };
}

export function createLoopControllerStep(): ApiScenarioStep {
  return {
    id: stepId('loop'),
    name: 'Loop Controller',
    stepName: 'Loop Controller',
    stepType: 'LOOP_CONTROLLER',
    enabled: true,
    resourceId: null,
    resourceType: null,
    requestConfig: null,
    loopType: 'FIXED',
    loopCount: 1,
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
      name: step.name || step.stepName || fallbackStepName(step),
      stepName: step.stepName || step.name || fallbackStepName(step),
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

    if (base.stepType === 'CONSTANT_TIMER') {
      return {
        ...base,
        stepType: 'CONSTANT_TIMER',
        resource: null,
        resourceId: null,
        resourceType: null,
        definitionId: null,
        definitionName: null,
        caseId: null,
        caseName: null,
        requestConfig: null,
        assertions: [],
        preProcessors: [],
        postProcessors: [],
        delayMs: normalizeWaitDelay(base.delayMs),
        children: []
      };
    }

    if (base.stepType === 'SCRIPT') {
      return {
        ...base,
        stepType: 'SCRIPT',
        resource: null,
        resourceId: null,
        resourceType: null,
        definitionId: null,
        definitionName: null,
        caseId: null,
        caseName: null,
        requestConfig: null,
        script: base.script || '',
        preProcessors: [],
        postProcessors: [],
        children: []
      };
    }

    if (base.stepType === 'ONCE_ONLY_CONTROLLER') {
      return {
        ...base,
        stepType: 'ONCE_ONLY_CONTROLLER',
        resource: null,
        resourceId: null,
        resourceType: null,
        definitionId: null,
        definitionName: null,
        caseId: null,
        caseName: null,
        requestConfig: null,
        assertions: [],
        preProcessors: [],
        postProcessors: []
      };
    }

    if (base.stepType === 'IF_CONTROLLER') {
      return {
        ...base,
        stepType: 'IF_CONTROLLER',
        resource: null,
        resourceId: null,
        resourceType: null,
        definitionId: null,
        definitionName: null,
        caseId: null,
        caseName: null,
        requestConfig: null,
        conditionType: 'EXPRESSION',
        conditionExpression: base.conditionExpression || 'true',
        assertions: [],
        preProcessors: [],
        postProcessors: []
      };
    }

    if (base.stepType === 'LOOP_CONTROLLER') {
      return {
        ...base,
        stepType: 'LOOP_CONTROLLER',
        resource: null,
        resourceId: null,
        resourceType: null,
        definitionId: null,
        definitionName: null,
        caseId: null,
        caseName: null,
        requestConfig: null,
        loopType: 'FIXED',
        loopCount: normalizeLoopCount(base.loopCount),
        conditionType: null,
        conditionExpression: null,
        foreachExpression: null,
        assertions: [],
        preProcessors: [],
        postProcessors: []
      };
    }

    return {
      ...base,
      stepType: 'CUSTOM_REQUEST',
      resource: null,
      resourceId: null,
      resourceType: 'CUSTOM',
      definitionId: null,
      definitionName: null,
      caseId: null,
      caseName: null,
      requestConfig: createDefaultRequestConfig()
    };
  });
}

function fallbackStepName(step: ApiScenarioStep) {
  const names: Record<string, string> = {
    API: 'API Definition Step',
    API_CASE: 'API Case Step',
    CUSTOM_REQUEST: 'Custom Request',
    GROUP: 'Step Group',
    CONSTANT_TIMER: 'Constant Timer',
    SCRIPT: 'Script',
    ONCE_ONLY_CONTROLLER: 'Once-only Controller',
    IF_CONTROLLER: 'If Controller',
    LOOP_CONTROLLER: 'Loop Controller'
  };

  return names[step.stepType] || 'Scenario Step';
}

function normalizeWaitDelay(delayMs?: number | string | null) {
  const value = Number(delayMs ?? 1000);

  if (!Number.isFinite(value)) {
    return 1000;
  }

  return Math.max(1, Math.min(60000, Math.round(value)));
}

function normalizeLoopCount(loopCount?: number | string | null) {
  const value = Number(loopCount ?? 1);

  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(0, Math.min(50, Math.round(value)));
}

type ApiScenarioStepPayload = Omit<ApiScenarioStep, 'name' | 'children'> & {
  stepName: string;
  children: ApiScenarioStepPayload[];
};

function toSaveScenarioStepPayload(step: ApiScenarioStep): ApiScenarioStepPayload {
  const normalized = normalizeScenarioSteps([step])[0];
  const payload: ApiScenarioStepPayload = {
    ...normalized,
    stepName: normalized.name || normalized.stepName || fallbackStepName(normalized),
    children: (normalized.children || []).map(toSaveScenarioStepPayload)
  };
  delete (payload as Partial<ApiScenarioStep>).name;

  if (payload.stepType === 'GROUP') {
    payload.stepType = 'CUSTOM_REQUEST';
  }

  if (payload.stepType === 'CONSTANT_TIMER') {
    payload.children = [];
    payload.delayMs = normalizeWaitDelay(payload.delayMs);
  }

  if (payload.stepType === 'SCRIPT') {
    payload.children = [];
    payload.resource = null;
    payload.resourceId = null;
    payload.resourceType = null;
    payload.requestConfig = null;
    payload.script = (payload.script || '').trim();
  }

  if (payload.stepType === 'ONCE_ONLY_CONTROLLER') {
    payload.resource = null;
    payload.resourceId = null;
    payload.resourceType = null;
    payload.requestConfig = null;
    payload.assertions = [];
    payload.preProcessors = [];
    payload.postProcessors = [];
  }

  if (payload.stepType === 'IF_CONTROLLER') {
    payload.resource = null;
    payload.resourceId = null;
    payload.resourceType = null;
    payload.requestConfig = null;
    payload.conditionType = 'EXPRESSION';
    payload.conditionExpression = payload.conditionExpression || 'true';
    payload.assertions = [];
    payload.preProcessors = [];
    payload.postProcessors = [];
  }

  if (payload.stepType === 'LOOP_CONTROLLER') {
    payload.resource = null;
    payload.resourceId = null;
    payload.resourceType = null;
    payload.requestConfig = null;
    payload.loopType = 'FIXED';
    payload.loopCount = normalizeLoopCount(payload.loopCount);
    payload.conditionType = null;
    payload.conditionExpression = null;
    payload.foreachExpression = null;
    payload.assertions = [];
    payload.preProcessors = [];
    payload.postProcessors = [];
  }

  return payload;
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
    steps: form.steps.map(toSaveScenarioStepPayload)
  };
}
