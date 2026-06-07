<template>
  <section class="api-assertion-editor" data-testid="api-assertion-editor">
    <header class="api-assertion-editor__header">
      <div>
        <h4>{{ t.apiAutomation.assertionSection }}</h4>
        <p>{{ t.apiAutomation.assertionDescription }}</p>
      </div>
      <a-dropdown @select="handleAdd">
        <AppButton type="outline" data-testid="api-assertion-add">
          {{ t.apiAutomation.assertionAdd }}
        </AppButton>
        <template #content>
          <a-doption v-for="option in assertionTypes" :key="option.value" :value="option.value">
            {{ option.label }}
          </a-doption>
        </template>
      </a-dropdown>
    </header>

    <div v-if="assertions.length" class="api-assertion-editor__body">
      <aside class="api-assertion-editor__list">
        <button
          v-for="assertion in assertions"
          :key="assertion.id"
          type="button"
          :class="[
            'api-assertion-editor__item',
            { 'api-assertion-editor__item--active': assertion.id === activeAssertionId }
          ]"
          :data-testid="`api-assertion-item-${assertion.assertionType}`"
          @click="activeAssertionId = assertion.id || null"
        >
          <a-switch v-model="assertion.enabled" size="small" @click.stop />
          <span>{{ assertion.name || assertionTypeLabel(assertion.assertionType) }}</span>
          <small>{{ assertionTypeLabel(assertion.assertionType) }}</small>
        </button>
      </aside>

      <div v-if="activeAssertion" class="api-assertion-editor__detail">
        <div class="api-assertion-editor__toolbar">
          <a-input
            v-model="activeAssertion.name"
            data-testid="api-assertion-name-input"
            :placeholder="t.apiAutomation.assertionNamePlaceholder"
          />
          <AppButton
            type="text"
            status="danger"
            data-testid="api-assertion-remove"
            @click="removeAssertion(activeAssertion.id)"
          >
            {{ t.apiAutomation.assertionRemove }}
          </AppButton>
        </div>

        <a-grid v-if="activeAssertion.assertionType === 'RESPONSE_CODE'" :cols="{ xs: 1, md: 2 }" :col-gap="12">
          <a-grid-item>
            <a-form-item :label="t.apiAutomation.assertionCondition">
              <a-select v-model="activeAssertion.condition" data-testid="api-assertion-code-condition">
                <a-option v-for="option in assertionConditions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-option>
              </a-select>
            </a-form-item>
          </a-grid-item>
          <a-grid-item>
            <a-form-item :label="t.apiAutomation.assertionExpectedValue">
              <a-input v-model="activeAssertion.expectedValue" data-testid="api-assertion-code-expected" />
            </a-form-item>
          </a-grid-item>
        </a-grid>

        <div v-else-if="activeAssertion.assertionType === 'RESPONSE_HEADER'" class="api-assertion-editor__row">
          <a-form-item :label="t.apiAutomation.assertionHeaderName">
            <a-input v-model="headerAssertion.header" data-testid="api-assertion-header-name" />
          </a-form-item>
          <a-form-item :label="t.apiAutomation.assertionCondition">
            <a-select v-model="headerAssertion.condition">
              <a-option v-for="option in assertionConditions" :key="option.value" :value="option.value">
                {{ option.label }}
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="t.apiAutomation.assertionExpectedValue">
            <a-input v-model="headerAssertion.expectedValue" data-testid="api-assertion-header-expected" />
          </a-form-item>
        </div>

        <div v-else-if="activeAssertion.assertionType === 'RESPONSE_BODY'" class="api-assertion-editor__body-form">
          <a-form-item :label="t.apiAutomation.assertionBodyType">
            <a-radio-group v-model="activeAssertion.assertionBodyType" type="button" data-testid="api-assertion-body-type">
              <a-radio value="JSON_PATH">JSONPath</a-radio>
              <a-radio value="X_PATH">XPath</a-radio>
              <a-radio value="REGEX">Regex</a-radio>
            </a-radio-group>
          </a-form-item>
          <div class="api-assertion-editor__row">
            <a-form-item :label="t.apiAutomation.assertionExpression">
              <a-input v-model="bodyAssertion.expression" data-testid="api-assertion-body-expression" />
            </a-form-item>
            <a-form-item :label="t.apiAutomation.assertionCondition">
              <a-select v-model="bodyAssertion.condition">
                <a-option v-for="option in assertionConditions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="t.apiAutomation.assertionExpectedValue">
              <a-input v-model="bodyAssertion.expectedValue" data-testid="api-assertion-body-expected" />
            </a-form-item>
          </div>
        </div>

        <a-grid v-else :cols="{ xs: 1, md: 2 }" :col-gap="12">
          <a-grid-item>
            <a-form-item :label="t.apiAutomation.assertionCondition">
              <a-select v-model="activeAssertion.condition" data-testid="api-assertion-time-condition">
                <a-option v-for="option in assertionConditions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-option>
              </a-select>
            </a-form-item>
          </a-grid-item>
          <a-grid-item>
            <a-form-item :label="t.apiAutomation.assertionMaxDuration">
              <a-input v-model="activeAssertion.expectedValue" data-testid="api-assertion-time-expected" />
            </a-form-item>
          </a-grid-item>
        </a-grid>
      </div>
    </div>

    <div v-else class="api-assertion-editor__empty" data-testid="api-assertion-empty">
      {{ t.apiAutomation.assertionEmpty }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import type {
  ApiAssertionConfig,
  ApiAssertionItemConfig,
  ApiAssertionType
} from '@entities/api-automation';
import { t } from '@shared/i18n';
import { AppButton } from '@shared/ui';

import {
  assertionConditions,
  assertionTypeLabel,
  assertionTypes,
  createAssertion
} from '../model/assertionOptions';

const assertions = defineModel<ApiAssertionConfig[]>({ required: true });
const activeAssertionId = ref<string | null>(null);

const activeAssertion = computed(() =>
  assertions.value.find((assertion) => assertion.id === activeAssertionId.value) || null
);

const headerAssertion = computed<ApiAssertionItemConfig>(() => activeAssertion.value?.assertions?.[0] || {});

const bodyAssertion = computed<ApiAssertionItemConfig>(() => {
  if (!activeAssertion.value) {
    return {};
  }

  const groupKey = bodyGroupKey(activeAssertion.value.assertionBodyType);
  return activeAssertion.value[groupKey]?.assertions[0] || {};
});

watch(activeAssertion, (assertion) => {
  if (!assertion) {
    return;
  }

  if (assertion.assertionType === 'RESPONSE_HEADER' && !assertion.assertions?.length) {
    assertion.assertions = [
      {
        header: 'Content-Type',
        condition: 'CONTAINS',
        expectedValue: 'json',
        enabled: true
      }
    ];
  }

  if (assertion.assertionType === 'RESPONSE_BODY') {
    assertion.assertionBodyType ||= 'JSON_PATH';
    const groupKey = bodyGroupKey(assertion.assertionBodyType);
    assertion[groupKey] ||= {
      assertions: [
        {
          expression: assertion.assertionBodyType === 'REGEX' ? '.+' : '$.success',
          condition: 'EQUALS',
          expectedValue: assertion.assertionBodyType === 'REGEX' ? '' : 'true',
          enabled: true
        }
      ],
      responseFormat: 'XML'
    };
  }
}, { immediate: true });

watch(
  assertions,
  (value) => {
    if (!value.length) {
      activeAssertionId.value = null;
      return;
    }

    if (!activeAssertionId.value || !value.some((assertion) => assertion.id === activeAssertionId.value)) {
      activeAssertionId.value = value[0].id || null;
    }
  },
  { immediate: true, deep: true }
);

function handleAdd(type: string | number | Record<string, unknown> | undefined) {
  const assertion = createAssertion(type as ApiAssertionType);
  assertions.value = [...assertions.value, assertion];
  activeAssertionId.value = assertion.id || null;
}

function removeAssertion(id?: string) {
  assertions.value = assertions.value.filter((assertion) => assertion.id !== id);
}

function bodyGroupKey(type?: string) {
  if (type === 'X_PATH') {
    return 'xpathAssertion';
  }

  if (type === 'REGEX') {
    return 'regexAssertion';
  }

  return 'jsonPathAssertion';
}
</script>

<style scoped>
.api-assertion-editor {
  display: grid;
  gap: var(--app-spacing-md);
  min-width: 0;
}

.api-assertion-editor__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--app-spacing-md);
}

.api-assertion-editor__header h4,
.api-assertion-editor__header p {
  margin: 0;
}

.api-assertion-editor__header h4 {
  font-size: 14px;
  font-weight: 650;
}

.api-assertion-editor__header p {
  margin-top: 4px;
  color: var(--app-color-text-muted);
  font-size: 12px;
}

.api-assertion-editor__body {
  display: grid;
  grid-template-columns: minmax(180px, 220px) minmax(0, 1fr);
  gap: var(--app-spacing-md);
  min-width: 0;
}

.api-assertion-editor__list,
.api-assertion-editor__detail,
.api-assertion-editor__empty {
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: var(--app-color-surface);
}

.api-assertion-editor__list {
  display: grid;
  align-content: start;
  gap: 6px;
  padding: 8px;
}

.api-assertion-editor__item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 4px 8px;
  align-items: center;
  width: 100%;
  border: 1px solid transparent;
  border-radius: var(--app-radius-sm);
  background: transparent;
  color: var(--app-color-text);
  cursor: pointer;
  padding: 8px;
  text-align: left;
}

.api-assertion-editor__item span,
.api-assertion-editor__item small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-assertion-editor__item small {
  grid-column: 2;
  color: var(--app-color-text-muted);
}

.api-assertion-editor__item--active {
  border-color: #94a3b8;
  background: #f8fafc;
}

.api-assertion-editor__detail {
  display: grid;
  gap: var(--app-spacing-md);
  min-width: 0;
  padding: var(--app-spacing-md);
}

.api-assertion-editor__toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--app-spacing-sm);
}

.api-assertion-editor__row {
  display: grid;
  grid-template-columns: minmax(160px, 1fr) minmax(160px, 180px) minmax(160px, 1fr);
  gap: var(--app-spacing-sm);
}

.api-assertion-editor__body-form {
  display: grid;
  gap: var(--app-spacing-sm);
}

.api-assertion-editor__empty {
  color: var(--app-color-text-muted);
  padding: var(--app-spacing-lg);
  text-align: center;
}

@media (max-width: 960px) {
  .api-assertion-editor__body,
  .api-assertion-editor__row,
  .api-assertion-editor__toolbar {
    grid-template-columns: 1fr;
  }
}
</style>
