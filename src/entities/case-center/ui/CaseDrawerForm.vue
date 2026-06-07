<template>
  <Teleport to="body">
    <div v-if="visible" class="case-drawer-form">
      <button
        class="case-drawer-form__mask"
        type="button"
        :aria-label="t.common.cancel"
        @click="emit('update:visible', false)"
      ></button>
      <aside class="case-drawer-form__panel" role="dialog" aria-modal="true">
        <header class="case-drawer-form__header">
          <div>
            <h2>{{ title }}</h2>
            <p>{{ subtitle || t.caseCenter.fallbackName }}</p>
          </div>
          <button
            class="case-drawer-form__close"
            type="button"
            :aria-label="t.common.cancel"
            @click="emit('update:visible', false)"
          >
            <span></span>
          </button>
        </header>

        <AppLoadingState v-if="loading" class="case-drawer-form__loading" />
        <div v-else class="case-drawer-form__body">
          <label class="case-drawer-form__field">
            <span>
              {{ t.caseCenter.fieldCaseName }}
              <em>*</em>
            </span>
            <a-input
              :model-value="form.title"
              :placeholder="t.caseCenter.fieldTitlePlaceholder"
              @update:model-value="updateField('title', $event)"
            />
          </label>

          <div class="case-drawer-form__field">
            <span>{{ t.caseCenter.fieldCaseModule }}</span>
            <div class="case-drawer-form__path-row">
              <div class="case-drawer-form__path" :title="pathLabel">
                {{ pathLabel }}
              </div>
              <button
                class="case-drawer-form__path-button"
                type="button"
                :title="t.caseCenter.pathSelectUnavailable"
                @click="showPathTip = true"
              >
                <span></span>
              </button>
            </div>
          </div>

          <div class="case-drawer-form__field">
            <span>{{ t.caseCenter.fieldPriority }}</span>
            <div class="case-drawer-form__segments">
              <button
                v-for="priority in priorities"
                :key="priority"
                type="button"
                :class="{ 'is-active': form.priority === priority }"
                @click="updateField('priority', priority)"
              >
                {{ priority }}
              </button>
            </div>
          </div>

          <div class="case-drawer-form__compact-grid">
            <label class="case-drawer-form__field">
              <span>
                {{ t.caseCenter.fieldCaseType }}
                <em>*</em>
              </span>
              <a-input
                :model-value="form.caseType"
                :placeholder="t.caseCenter.fieldCaseTypePlaceholder"
                @update:model-value="updateField('caseType', $event)"
              />
            </label>
            <label class="case-drawer-form__field">
              <span>
                {{ t.caseCenter.fieldSourceType }}
                <em>*</em>
              </span>
              <a-input
                :model-value="form.sourceType"
                :placeholder="t.caseCenter.fieldSourceTypePlaceholder"
                @update:model-value="updateField('sourceType', $event)"
              />
            </label>
            <label class="case-drawer-form__field">
              <span>
                {{ t.caseCenter.fieldStatus }}
                <em>*</em>
              </span>
              <a-input
                :model-value="form.caseStatus"
                :placeholder="t.caseCenter.fieldCaseStatusPlaceholder"
                @update:model-value="updateField('caseStatus', $event)"
              />
            </label>
          </div>

          <label class="case-drawer-form__field">
            <span>{{ t.caseCenter.fieldPrecondition }}</span>
            <a-textarea
              :model-value="form.precondition"
              :auto-size="{ minRows: 3, maxRows: 5 }"
              :placeholder="t.caseCenter.fieldPreconditionPlaceholder"
              @update:model-value="updateField('precondition', $event)"
            />
          </label>

          <label class="case-drawer-form__field">
            <span>{{ t.caseCenter.fieldSteps }}</span>
            <a-textarea
              :model-value="form.steps"
              :auto-size="{ minRows: 4, maxRows: 7 }"
              :placeholder="t.caseCenter.fieldStepsPlaceholder"
              @update:model-value="updateField('steps', $event)"
            />
          </label>

          <label class="case-drawer-form__field">
            <span>{{ t.caseCenter.fieldExpectedResult }}</span>
            <a-textarea
              :model-value="form.expectedResult"
              :auto-size="{ minRows: 3, maxRows: 5 }"
              :placeholder="t.caseCenter.fieldExpectedResultPlaceholder"
              @update:model-value="updateField('expectedResult', $event)"
            />
          </label>
        </div>

        <footer class="case-drawer-form__footer">
          <AppButton type="secondary" @click="emit('update:visible', false)">
            {{ t.common.cancel }}
          </AppButton>
          <AppButton type="primary" :loading="saving" @click="emit('submit')">
            {{ t.common.save }}
          </AppButton>
        </footer>
      </aside>

      <div v-if="showPathTip" class="case-drawer-form__path-modal">
        <button
          class="case-drawer-form__path-mask"
          type="button"
          :aria-label="t.common.cancel"
          @click="showPathTip = false"
        ></button>
        <section class="case-drawer-form__path-panel" role="dialog" aria-modal="true">
          <header>
            <strong>{{ t.caseCenter.selectPathTitle }}</strong>
            <button type="button" @click="showPathTip = false">x</button>
          </header>
          <div class="case-drawer-form__path-current">
            <span>{{ t.caseCenter.currentPath }}</span>
            <strong>{{ pathLabel }}</strong>
          </div>
          <p>{{ t.caseCenter.pathSelectUnavailable }}</p>
          <footer>
            <AppButton type="primary" @click="showPathTip = false">
              {{ t.common.confirm }}
            </AppButton>
          </footer>
        </section>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import type { CaseFormValues } from '../model/types';
import { t } from '@shared/i18n';
import { AppButton, AppLoadingState } from '@shared/ui';

const props = defineProps<{
  visible: boolean;
  title: string;
  subtitle?: string;
  form: CaseFormValues;
  saving?: boolean;
  loading?: boolean;
  directoryName?: string | null;
}>();

const emit = defineEmits<{
  'update:visible': [visible: boolean];
  'update-field': [field: EditableStringField, value: string];
  submit: [];
}>();

const priorities = ['P0', 'P1', 'P2', 'P3'];
const showPathTip = ref(false);

const pathLabel = computed(() => props.directoryName || t.caseCenter.allDirectories);

type EditableStringField =
  | 'title'
  | 'caseType'
  | 'priority'
  | 'sourceType'
  | 'caseStatus'
  | 'precondition'
  | 'steps'
  | 'expectedResult';

function updateField(field: EditableStringField, value: string) {
  emit('update-field', field, value);
}
</script>

<style scoped>
.case-drawer-form {
  position: fixed;
  inset: 0;
  z-index: 1000;
}

.case-drawer-form__mask,
.case-drawer-form__path-mask {
  position: fixed;
  inset: 0;
  border: 0;
  background: rgba(0, 0, 0, 0.2);
  cursor: default;
}

.case-drawer-form__panel {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: min(480px, 100vw);
  height: 100vh;
  overflow: hidden;
  background: #ffffff;
  box-shadow: -14px 0 36px rgba(15, 23, 42, 0.18);
}

.case-drawer-form__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  border-bottom: 1px solid #f3f4f6;
  padding: 16px 24px;
}

.case-drawer-form__header h2 {
  margin: 0;
  color: #111827;
  font-size: 16px;
  font-weight: 650;
  line-height: 24px;
}

.case-drawer-form__header p {
  margin: 2px 0 0;
  color: #9ca3af;
  font-size: 12px;
  line-height: 18px;
}

.case-drawer-form__close,
.case-drawer-form__path-button,
.case-drawer-form__path-panel header button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease;
}

.case-drawer-form__close {
  width: 32px;
  height: 32px;
}

.case-drawer-form__close:hover,
.case-drawer-form__path-panel header button:hover {
  background: #f3f4f6;
  color: #4b5563;
}

.case-drawer-form__close span,
.case-drawer-form__close span::after {
  width: 14px;
  height: 1.5px;
  border-radius: 999px;
  background: currentColor;
}

.case-drawer-form__close span {
  position: relative;
  transform: rotate(45deg);
}

.case-drawer-form__close span::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  transform: rotate(90deg);
}

.case-drawer-form__loading {
  margin: 24px;
}

.case-drawer-form__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
  overflow-y: auto;
  padding: 20px 24px;
}

.case-drawer-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.case-drawer-form__field > span {
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.case-drawer-form__field em {
  color: #ef4444;
  font-style: normal;
}

.case-drawer-form__field :deep(.arco-input-wrapper),
.case-drawer-form__field :deep(.arco-textarea-wrapper) {
  border-color: #d1d5db;
  border-radius: 8px;
  background: #ffffff;
}

.case-drawer-form__field :deep(.arco-input),
.case-drawer-form__field :deep(.arco-textarea) {
  color: #111827;
  font-size: 14px;
}

.case-drawer-form__path-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.case-drawer-form__path {
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 0;
  height: 36px;
  overflow: hidden;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #111827;
  font-size: 14px;
  padding: 0 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.case-drawer-form__path-button {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border: 1px solid #d1d5db;
}

.case-drawer-form__path-button:hover {
  border-color: #60a5fa;
  background: #f9fafb;
  color: #2563eb;
}

.case-drawer-form__path-button span {
  position: relative;
  width: 16px;
  height: 12px;
  border-radius: 2px;
  background: currentColor;
}

.case-drawer-form__path-button span::before {
  content: "";
  position: absolute;
  left: 1px;
  top: -4px;
  width: 8px;
  height: 5px;
  border-radius: 2px 2px 0 0;
  background: currentColor;
}

.case-drawer-form__segments {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 2px;
  border-radius: 8px;
  background: #f3f4f6;
  padding: 4px;
}

.case-drawer-form__segments button {
  min-width: 48px;
  height: 30px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.case-drawer-form__segments button:hover {
  color: #374151;
}

.case-drawer-form__segments button.is-active {
  background: #ffffff;
  color: #111827;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
}

.case-drawer-form__compact-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.case-drawer-form__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  gap: 8px;
  border-top: 1px solid #f3f4f6;
  background: #f9fafb;
  padding: 14px 24px;
}

.case-drawer-form__footer :deep(.arco-btn) {
  min-width: 76px;
  height: 34px;
  border-radius: 8px;
}

.case-drawer-form__path-modal {
  position: fixed;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.case-drawer-form__path-mask {
  background: rgba(0, 0, 0, 0.3);
}

.case-drawer-form__path-panel {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: min(420px, calc(100vw - 32px));
  overflow: hidden;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.24);
}

.case-drawer-form__path-panel header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f3f4f6;
  padding: 16px 20px;
}

.case-drawer-form__path-panel header strong {
  color: #111827;
  font-size: 16px;
  line-height: 24px;
}

.case-drawer-form__path-panel header button {
  width: 28px;
  height: 28px;
  font-size: 14px;
}

.case-drawer-form__path-current {
  border-bottom: 1px solid #f3f4f6;
  background: #f9fafb;
  padding: 12px 20px;
}

.case-drawer-form__path-current span {
  display: block;
  color: #9ca3af;
  font-size: 12px;
  line-height: 18px;
}

.case-drawer-form__path-current strong {
  display: block;
  margin-top: 2px;
  color: #374151;
  font-size: 14px;
  line-height: 20px;
}

.case-drawer-form__path-panel p {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 22px;
  padding: 18px 20px;
}

.case-drawer-form__path-panel footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f3f4f6;
  padding: 12px 20px;
}

@media (max-width: 520px) {
  .case-drawer-form__compact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
