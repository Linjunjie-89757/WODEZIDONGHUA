<template>
  <div class="api-request-param-table">
    <div class="api-automation-shell__param-tools">
      <button
        type="button"
        class="api-automation-shell__batch-link"
        :data-testid="`${testIdPrefix}-batch-add`"
        @click="$emit('batch-add')"
      >
        <span data-testid="api-definition-param-batch-add">{{ t.apiAutomation.batchAdd }}</span>
      </button>
      <button
        type="button"
        class="api-automation-shell__batch-link"
        :data-testid="`${testIdPrefix}-batch-add-enable-all`"
        @click="$emit('enable-all')"
      >
        {{ t.apiAutomation.enableAll }}
      </button>
      <button
        type="button"
        class="api-automation-shell__batch-link"
        :data-testid="`${testIdPrefix}-batch-add-disable-all`"
        @click="$emit('disable-all')"
      >
        {{ t.apiAutomation.disableAll }}
      </button>
      <button
        type="button"
        class="api-automation-shell__batch-link"
        :data-testid="`${testIdPrefix}-batch-add-clear-empty`"
        @click="$emit('clear-empty')"
      >
        {{ t.apiAutomation.clearEmptyRows }}
      </button>
    </div>

    <div :class="['api-automation-shell__kv-table-header', tableHeaderClass]">
      <span>{{ t.apiAutomation.enabled }}</span>
      <span>{{ keyLabel }}</span>
      <span>{{ t.apiAutomation.paramType }}</span>
      <span>{{ valueLabel }}</span>
      <span>{{ t.apiAutomation.lengthRange }}</span>
      <span v-if="showEncode">{{ t.apiAutomation.encode }}</span>
      <span>{{ t.apiAutomation.fieldDescription }}</span>
      <span>{{ t.common.actions }}</span>
    </div>

    <div
      v-for="(row, index) in rows"
      :key="`${rowPrefix}-${index}`"
      :class="['api-automation-shell__kv-table-row', tableRowClass]"
      :data-testid="rowTestId"
    >
      <a-switch v-model="row.enabled" size="small" />
      <a-input v-model="row.key" :data-testid="keyInputTestId" />
      <div class="api-automation-shell__param-type-cell">
        <button
          type="button"
          :class="['api-automation-shell__required-toggle', { 'api-automation-shell__required-toggle--active': row.required }]"
          data-testid="api-definition-param-required-toggle"
          @click="row.required = !row.required"
        >
          *
        </button>
        <a-select
          v-model="row.paramType"
          data-testid="api-definition-param-type-select"
          size="small"
        >
          <a-option v-for="type in paramTypes" :key="type" :value="type">
            {{ type }}
          </a-option>
        </a-select>
      </div>
      <a-input v-model="row.value" :data-testid="valueInputTestId" />
      <div class="api-automation-shell__length-cell">
        <a-input-number
          v-model="row.minLength"
          data-testid="api-definition-param-min-length-input"
          size="small"
          :min="0"
          :placeholder="t.apiAutomation.minLength"
        />
        <span>-</span>
        <a-input-number
          v-model="row.maxLength"
          data-testid="api-definition-param-max-length-input"
          size="small"
          :min="0"
          :placeholder="t.apiAutomation.maxLength"
        />
      </div>
      <a-switch
        v-if="showEncode"
        v-model="row.encode"
        data-testid="api-definition-param-encode-toggle"
        size="small"
      />
      <a-input v-model="row.description" data-testid="api-definition-param-description-input" />
      <AppButton type="text" status="danger" @click="$emit('remove-row', index)">
        {{ t.common.delete }}
      </AppButton>
    </div>

    <AppButton type="text" :data-testid="addRowTestId" @click="$emit('add-row')">
      {{ t.apiAutomation.addRow }}
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import type { ApiKeyValue } from '@entities/api-automation';
import { t } from '@shared/i18n';
import { AppButton } from '@shared/ui';

defineProps<{
  rows: ApiKeyValue[];
  testIdPrefix: string;
  rowTestId: string;
  rowPrefix: string;
  tableHeaderClass: string;
  tableRowClass: string;
  keyInputTestId: string;
  valueInputTestId: string;
  addRowTestId: string;
  keyLabel: string;
  valueLabel: string;
  paramTypes: readonly string[];
  showEncode?: boolean;
}>();

defineEmits<{
  (event: 'batch-add'): void;
  (event: 'enable-all'): void;
  (event: 'disable-all'): void;
  (event: 'clear-empty'): void;
  (event: 'add-row'): void;
  (event: 'remove-row', index: number): void;
}>();
</script>

<style scoped>
.api-request-param-table {
  display: grid;
  gap: 0;
  min-width: 0;
}

:global(.api-automation-shell__kv-table-header),
:global(.api-automation-shell__kv-table-row) {
  display: grid;
  gap: 8px;
  align-items: center;
  min-width: 860px;
  border-bottom: 1px solid var(--app-color-border);
  padding: 6px 8px;
}

:global(.api-automation-shell__kv-table-header) {
  min-height: 32px;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm) var(--app-radius-sm) 0 0;
  background: #f8fafc;
  color: var(--app-color-text-muted);
  font-size: 12px;
  font-weight: 600;
}

:global(.api-automation-shell__kv-table-row) {
  border-right: 1px solid var(--app-color-border);
  border-left: 1px solid var(--app-color-border);
  background: #ffffff;
}

:global(.api-automation-shell__kv-table-row:hover) {
  background: #fbfdff;
}

:global(.api-automation-shell__kv-table-row--header),
:global(.api-automation-shell__kv-table-header--header),
:global(.api-automation-shell__kv-table-row--query),
:global(.api-automation-shell__kv-table-header--query) {
  grid-template-columns: 48px minmax(150px, 1fr) minmax(132px, 0.7fr) minmax(170px, 1fr) minmax(150px, 0.8fr) 64px minmax(150px, 0.9fr) 76px;
}

:global(.api-automation-shell__kv-table-row--body),
:global(.api-automation-shell__kv-table-header--body) {
  grid-template-columns: 48px minmax(150px, 1fr) minmax(132px, 0.7fr) minmax(170px, 1fr) minmax(150px, 0.8fr) minmax(150px, 0.9fr) 76px;
}

:global(.api-automation-shell__param-type-cell),
:global(.api-automation-shell__length-cell) {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

:global(.api-automation-shell__param-type-cell .arco-select) {
  min-width: 92px;
}

:global(.api-automation-shell__length-cell .arco-input-number) {
  width: 68px;
}

:global(.api-automation-shell__length-cell span) {
  color: var(--app-color-text-muted);
  font-size: 12px;
}

:global(.api-automation-shell__required-toggle) {
  display: inline-grid;
  width: 22px;
  min-width: 22px;
  height: 22px;
  place-items: center;
  border: 1px solid var(--app-color-border);
  border-radius: 999px;
  background: #ffffff;
  color: var(--app-color-text-muted);
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
}

:global(.api-automation-shell__required-toggle--active) {
  border-color: #ef4444;
  background: #fef2f2;
  color: #dc2626;
}

:global(.api-automation-shell__batch-link) {
  border: 0;
  background: transparent;
  color: rgb(var(--primary-6));
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  padding: 0;
  text-align: left;
}

:global(.api-automation-shell__param-tools) {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  min-height: 28px;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: #fbfcfe;
  padding: 4px 8px;
}
</style>
