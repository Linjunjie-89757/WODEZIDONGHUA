<template>
  <AppButton type="primary" @click="open">{{ t.caseCenter.create }}</AppButton>
  <AppDialog
    v-model:visible="visible"
    :title="t.caseCenter.createTitle"
    :ok-text="t.common.save"
    :cancel-text="t.common.cancel"
    :confirm-loading="saving"
    :before-ok="handleSubmit"
  >
    <a-form :model="form" layout="vertical">
      <a-form-item field="title" :label="t.caseCenter.fieldTitle" required>
        <a-input v-model="form.title" :placeholder="t.caseCenter.fieldTitlePlaceholder" />
      </a-form-item>
      <a-form-item field="caseType" :label="t.caseCenter.fieldCaseType" required>
        <a-input v-model="form.caseType" :placeholder="t.caseCenter.fieldCaseTypePlaceholder" />
      </a-form-item>
      <a-form-item field="priority" :label="t.caseCenter.fieldPriority" required>
        <a-input v-model="form.priority" :placeholder="t.caseCenter.fieldPriorityPlaceholder" />
      </a-form-item>
      <a-form-item field="sourceType" :label="t.caseCenter.fieldSourceType" required>
        <a-input v-model="form.sourceType" :placeholder="t.caseCenter.fieldSourceTypePlaceholder" />
      </a-form-item>
      <a-form-item field="caseStatus" :label="t.caseCenter.fieldStatus" required>
        <a-input v-model="form.caseStatus" :placeholder="t.caseCenter.fieldCaseStatusPlaceholder" />
      </a-form-item>
      <a-form-item field="precondition" :label="t.caseCenter.fieldPrecondition">
        <a-textarea
          v-model="form.precondition"
          :auto-size="{ minRows: 3, maxRows: 6 }"
          :placeholder="t.caseCenter.fieldPreconditionPlaceholder"
        />
      </a-form-item>
      <a-form-item field="steps" :label="t.caseCenter.fieldSteps">
        <a-textarea
          v-model="form.steps"
          :auto-size="{ minRows: 4, maxRows: 8 }"
          :placeholder="t.caseCenter.fieldStepsPlaceholder"
        />
      </a-form-item>
      <a-form-item field="expectedResult" :label="t.caseCenter.fieldExpectedResult">
        <a-textarea
          v-model="form.expectedResult"
          :auto-size="{ minRows: 3, maxRows: 6 }"
          :placeholder="t.caseCenter.fieldExpectedResultPlaceholder"
        />
      </a-form-item>
    </a-form>
  </AppDialog>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { AppButton, AppDialog } from '@shared/ui';

import { useCaseCreate } from '../model/useCaseCreate';

const emit = defineEmits<{
  success: [];
}>();

const { visible, saving, form, open, submit } = useCaseCreate();

async function handleSubmit() {
  const succeed = await submit();

  if (succeed) {
    emit('success');
  }

  return succeed;
}
</script>
