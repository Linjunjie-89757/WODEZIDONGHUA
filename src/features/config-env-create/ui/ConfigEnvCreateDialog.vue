<template>
  <AppButton type="primary" @click="open">{{ t.configCenter.envCreate }}</AppButton>
  <AppDialog
    v-model:visible="visible"
    :title="t.configCenter.envCreateTitle"
    :ok-text="t.common.save"
    :cancel-text="t.common.cancel"
    :confirm-loading="saving"
    :before-ok="handleSubmit"
  >
    <a-form :model="form" layout="vertical">
      <a-form-item field="envName" :label="t.configCenter.fieldEnvName" required>
        <a-input v-model="form.envName" :placeholder="t.configCenter.fieldEnvNamePlaceholder" />
      </a-form-item>
      <a-form-item field="envType" :label="t.configCenter.fieldEnvType" required>
        <a-input v-model="form.envType" :placeholder="t.configCenter.fieldEnvTypePlaceholder" />
      </a-form-item>
      <a-form-item field="baseUrl" :label="t.configCenter.fieldBaseUrl" required>
        <a-input v-model="form.baseUrl" :placeholder="t.configCenter.fieldBaseUrlPlaceholder" />
      </a-form-item>
      <a-form-item field="configJson" :label="t.configCenter.fieldConfigJson">
        <a-textarea
          v-model="form.configJson"
          :auto-size="{ minRows: 4, maxRows: 8 }"
          :placeholder="t.configCenter.fieldConfigJsonPlaceholder"
        />
      </a-form-item>
    </a-form>
  </AppDialog>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { AppButton, AppDialog } from '@shared/ui';

import { useConfigEnvCreate } from '../model/useConfigEnvCreate';

const emit = defineEmits<{
  success: [];
}>();

const { visible, saving, form, open, submit } = useConfigEnvCreate();

async function handleSubmit() {
  const succeed = await submit();

  if (succeed) {
    emit('success');
  }

  return succeed;
}
</script>
