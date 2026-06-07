<template>
  <AppButton type="text" @click="open(connection)">{{ t.common.edit }}</AppButton>
  <AppDialog
    v-model:visible="visible"
    :title="`${t.aiConnection.editTitle} ${current?.name || t.aiConnection.editFallbackName}`"
    :ok-text="t.common.save"
    :cancel-text="t.common.cancel"
    :confirm-loading="saving"
    :before-ok="handleSubmit"
  >
    <a-form :model="form" layout="vertical">
      <a-form-item
        field="connectionName"
        :label="t.aiConnection.fieldConnectionName"
        required
      >
        <a-input
          v-model="form.connectionName"
          :placeholder="t.aiConnection.fieldConnectionNamePlaceholder"
        />
      </a-form-item>
      <a-form-item field="protocolType" :label="t.aiConnection.fieldProtocolType" required>
        <a-select v-model="form.protocolType" :options="aiProtocolOptions" />
      </a-form-item>
      <a-form-item field="baseUrl" :label="t.aiConnection.fieldBaseUrl" required>
        <a-input v-model="form.baseUrl" :placeholder="t.aiConnection.fieldBaseUrlPlaceholder" />
      </a-form-item>
      <a-form-item field="modelName" :label="t.aiConnection.fieldModelName">
        <a-input
          v-model="form.modelName"
          :placeholder="t.aiConnection.fieldModelNamePlaceholder"
        />
      </a-form-item>
      <a-form-item field="apiKey" :label="t.aiConnection.fieldApiKey">
        <a-input-password
          v-model="form.apiKey"
          :placeholder="t.aiConnection.fieldApiKeyEditPlaceholder"
        />
      </a-form-item>
      <a-form-item field="requestTimeoutSeconds" :label="t.aiConnection.fieldTimeout">
        <a-input-number v-model="form.requestTimeoutSeconds" :min="1" :max="600" />
      </a-form-item>
      <a-form-item field="status" :label="t.aiConnection.fieldStatus">
        <a-radio-group v-model="form.status" type="button">
          <a-radio :value="1">{{ t.aiConnection.enabled }}</a-radio>
          <a-radio :value="0">{{ t.aiConnection.disabled }}</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </AppDialog>
</template>

<script setup lang="ts">
import { aiProtocolOptions, type AiConnection } from '@entities/ai-model';
import { t } from '@shared/i18n';
import { AppButton, AppDialog } from '@shared/ui';

import { useAiConnectionEdit } from '../model/useAiConnectionEdit';

defineProps<{
  connection: AiConnection;
}>();

const emit = defineEmits<{
  success: [];
}>();

const { visible, saving, current, form, open, submit } = useAiConnectionEdit();

async function handleSubmit() {
  const succeed = await submit();

  if (succeed) {
    emit('success');
  }

  return succeed;
}
</script>
