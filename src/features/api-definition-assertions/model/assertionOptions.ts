import type {
  ApiAssertionCondition,
  ApiAssertionConfig,
  ApiAssertionType
} from '@entities/api-automation';
import { t } from '@shared/i18n';

export const assertionTypes: Array<{ label: string; value: ApiAssertionType }> = [
  { label: t.apiAutomation.assertionTypeStatusCode, value: 'RESPONSE_CODE' },
  { label: t.apiAutomation.assertionTypeResponseHeader, value: 'RESPONSE_HEADER' },
  { label: t.apiAutomation.assertionTypeResponseBody, value: 'RESPONSE_BODY' },
  { label: t.apiAutomation.assertionTypeResponseTime, value: 'RESPONSE_TIME' }
];

export const assertionConditions: Array<{ label: string; value: ApiAssertionCondition }> = [
  { label: t.apiAutomation.assertionConditionEquals, value: 'EQUALS' },
  { label: t.apiAutomation.assertionConditionNotEquals, value: 'NOT_EQUALS' },
  { label: t.apiAutomation.assertionConditionContains, value: 'CONTAINS' },
  { label: t.apiAutomation.assertionConditionNotContains, value: 'NOT_CONTAINS' },
  { label: t.apiAutomation.assertionConditionEmpty, value: 'EMPTY' },
  { label: t.apiAutomation.assertionConditionNotEmpty, value: 'NOT_EMPTY' },
  { label: t.apiAutomation.assertionConditionRegex, value: 'REGEX' },
  { label: t.apiAutomation.assertionConditionGt, value: 'GT' },
  { label: t.apiAutomation.assertionConditionGte, value: 'GT_OR_EQUALS' },
  { label: t.apiAutomation.assertionConditionLt, value: 'LT' },
  { label: t.apiAutomation.assertionConditionLte, value: 'LT_OR_EQUALS' }
];

function createId(type: ApiAssertionType) {
  return `assertion-${type.toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function assertionTypeLabel(type?: string) {
  return assertionTypes.find((option) => option.value === type)?.label || type || '';
}

export function assertionConditionLabel(condition?: string | null) {
  return assertionConditions.find((option) => option.value === condition)?.label || condition || '';
}

export function defaultAssertionName(type: ApiAssertionType) {
  return assertionTypeLabel(type) || t.apiAutomation.assertionFallbackName;
}

export function createAssertion(type: ApiAssertionType): ApiAssertionConfig {
  const id = createId(type);

  if (type === 'RESPONSE_HEADER') {
    return {
      id,
      assertionType: type,
      name: defaultAssertionName(type),
      enabled: true,
      assertions: [
        {
          header: 'Content-Type',
          condition: 'CONTAINS',
          expectedValue: 'json',
          enabled: true
        }
      ]
    };
  }

  if (type === 'RESPONSE_BODY') {
    return {
      id,
      assertionType: type,
      name: defaultAssertionName(type),
      enabled: true,
      assertionBodyType: 'JSON_PATH',
      jsonPathAssertion: {
        assertions: [
          {
            expression: '$.success',
            condition: 'EQUALS',
            expectedValue: 'true',
            enabled: true
          }
        ],
        responseFormat: 'XML'
      }
    };
  }

  if (type === 'RESPONSE_TIME') {
    return {
      id,
      assertionType: type,
      name: defaultAssertionName(type),
      enabled: true,
      condition: 'LT_OR_EQUALS',
      expectedValue: '1000'
    };
  }

  return {
    id,
    assertionType: type,
    name: defaultAssertionName(type),
    enabled: true,
    condition: 'EQUALS',
    expectedValue: '200'
  };
}
