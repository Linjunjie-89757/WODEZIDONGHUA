<template>
  <AppButton type="text" :loading="loadingDetail" @click="open(caseItem)">
    {{ t.common.edit }}
  </AppButton>
  <CaseDrawerForm
    v-model:visible="visible"
    :title="`${t.caseCenter.editTitle} ${current?.title || t.caseCenter.fallbackName}`"
    :subtitle="current?.caseNo || caseItem.caseNo"
    :form="form"
    :saving="saving"
    :loading="loadingDetail"
    :directory-name="current?.directoryName || caseItem.directoryName"
    @update-field="updateField"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { CaseDrawerForm, type CaseFormValues, type CaseSummaryItem } from '@entities/case-center';
import { t } from '@shared/i18n';
import { AppButton } from '@shared/ui';

import { useCaseEdit } from '../model/useCaseEdit';

defineProps<{
  caseItem: CaseSummaryItem;
}>();

const emit = defineEmits<{
  success: [];
}>();

const { visible, loadingDetail, saving, current, form, open, submit } = useCaseEdit();

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
