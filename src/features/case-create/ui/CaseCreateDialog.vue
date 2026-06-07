<template>
  <AppButton type="primary" @click="open">{{ t.caseCenter.create }}</AppButton>
  <CaseDrawerForm
    v-model:visible="visible"
    :title="t.caseCenter.createTitle"
    :subtitle="t.caseCenter.createSubtitle"
    :form="form"
    :saving="saving"
    @update-field="updateField"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { CaseDrawerForm, type CaseFormValues } from '@entities/case-center';
import { t } from '@shared/i18n';
import { AppButton } from '@shared/ui';

import { useCaseCreate } from '../model/useCaseCreate';

const emit = defineEmits<{
  success: [];
}>();

const { visible, saving, form, open, submit } = useCaseCreate();

type EditableCaseField = Extract<
  keyof CaseFormValues,
  | 'title'
  | 'caseType'
  | 'priority'
  | 'sourceType'
  | 'caseStatus'
  | 'precondition'
  | 'steps'
  | 'expectedResult'
>;

function updateField(field: EditableCaseField, value: string) {
  form.value[field] = value;
}

async function handleSubmit() {
  const succeed = await submit();

  if (succeed) {
    emit('success');
  }
}
</script>
