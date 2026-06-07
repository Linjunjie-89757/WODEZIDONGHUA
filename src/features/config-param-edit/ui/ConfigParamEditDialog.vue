<template>
  <AppButton type="text" @click="open(param)">{{ t.common.edit }}</AppButton>
  <AppDialog
    v-model:visible="visible"
    :title="`${t.configCenter.paramEditTitle} ${current?.paramName || t.configCenter.paramFallbackName}`"
    :ok-text="t.common.save"
    :cancel-text="t.common.cancel"
    :confirm-loading="saving"
    :before-ok="handleSubmit"
  >
    <a-form :model="form" layout="vertical">
      <a-form-item field="paramName" :label="t.configCenter.fieldParamName" required>
        <a-input
          v-model="form.paramName"
          :placeholder="t.configCenter.fieldParamNamePlaceholder"
        />
      </a-form-item>
      <a-form-item field="paramType" :label="t.configCenter.fieldParamType" required>
        <a-input
          v-model="form.paramType"
          :placeholder="t.configCenter.fieldParamTypePlaceholder"
        />
      </a-form-item>
      <a-form-item field="contentJson" :label="t.configCenter.fieldContentJson">
        <a-textarea
          v-model="form.contentJson"
          :auto-size="{ minRows: 4, maxRows: 8 }"
          :placeholder="t.configCenter.fieldContentJsonPlaceholder"
        />
      </a-form-item>
    </a-form>
  </AppDialog>
</template>

<script setup lang="ts">
import type { ParamSetItem } from '@entities/config-center';
import { t } from '@shared/i18n';
import { AppButton, AppDialog } from '@shared/ui';

import { useConfigParamEdit } from '../model/useConfigParamEdit';

defineProps<{
  param: ParamSetItem;
}>();

const emit = defineEmits<{
  success: [];
}>();

const { visible, saving, current, form, open, submit } = useConfigParamEdit();

async function handleSubmit() {
  const succeed = await submit();

  if (succeed) {
    emit('success');
  }

  return succeed;
}
</script>
