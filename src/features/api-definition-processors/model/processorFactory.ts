import type {
  ApiProcessorConfig,
  ApiProcessorExtractorConfig,
  ApiProcessorType
} from '@entities/api-automation';

export function createDefaultExtractor(): ApiProcessorExtractorConfig {
  return {
    name: '',
    variableName: '',
    description: '',
    variableType: 'TEMPORARY',
    extractType: 'JSON_PATH',
    extractScope: 'BODY',
    expression: '',
    expressionMatchingRule: 'EXPRESSION',
    resultMatchingRule: 'RANDOM',
    resultMatchingRuleNum: 1,
    responseFormat: 'JSON',
    enabled: true
  };
}

export function createDefaultProcessor(type: ApiProcessorType): ApiProcessorConfig {
  const base = {
    id: `${type.toLowerCase()}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: '',
    type,
    enabled: true,
    description: ''
  };

  if (type === 'SCRIPT') {
    return {
      ...base,
      name: 'Script',
      scriptLanguage: 'JAVASCRIPT',
      script: ''
    };
  }

  if (type === 'SQL') {
    return {
      ...base,
      name: 'SQL',
      dataSourceId: null,
      dataSourceName: '',
      queryTimeout: 10000,
      sql: '',
      variableNames: [],
      extractParams: [],
      resultVariable: ''
    };
  }

  if (type === 'EXTRACT') {
    return {
      ...base,
      name: 'Extract',
      extractors: [createDefaultExtractor()]
    };
  }

  return {
    ...base,
    name: 'Wait',
    delayMs: 1000,
    durationMs: 1000
  };
}
