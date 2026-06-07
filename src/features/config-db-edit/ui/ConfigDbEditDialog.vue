<template>
  <AppButton type="text" @click="open(db)">{{ t.common.edit }}</AppButton>
  <AppDialog
    v-model:visible="visible"
    :title="`${t.configCenter.dbEditTitle} ${current?.connectionName || t.configCenter.dbFallbackName}`"
    :ok-text="t.common.save"
    :cancel-text="t.common.cancel"
    :confirm-loading="saving"
    :before-ok="handleSubmit"
  >
    <a-form :model="form" layout="vertical">
      <a-form-item field="connectionName" :label="t.configCenter.fieldDbConnectionName" required>
        <a-input
          v-model="form.connectionName"
          :placeholder="t.configCenter.fieldDbConnectionNamePlaceholder"
        />
      </a-form-item>
      <a-form-item field="dbType" :label="t.configCenter.fieldDbType" required>
        <a-input v-model="form.dbType" :placeholder="t.configCenter.fieldDbTypePlaceholder" />
      </a-form-item>
      <a-form-item field="jdbcUrl" :label="t.configCenter.fieldJdbcUrl" required>
        <a-input v-model="form.jdbcUrl" :placeholder="t.configCenter.fieldJdbcUrlPlaceholder" />
      </a-form-item>
      <a-form-item field="driverClassName" :label="t.configCenter.fieldDriverClassName">
        <a-input
          v-model="form.driverClassName"
          :placeholder="t.configCenter.fieldDriverClassNamePlaceholder"
        />
      </a-form-item>
      <a-form-item field="username" :label="t.configCenter.fieldDbUsername">
        <a-input v-model="form.username" :placeholder="t.configCenter.fieldDbUsernamePlaceholder" />
      </a-form-item>
      <a-form-item field="password" :label="t.configCenter.fieldDbPassword">
        <a-input-password
          v-model="form.password"
          :placeholder="t.configCenter.fieldDbPasswordPlaceholder"
        />
      </a-form-item>
      <a-form-item field="poolMax" :label="t.configCenter.fieldPoolMax">
        <a-input-number
          v-model="form.poolMax"
          :min="1"
          :max="100"
          :placeholder="t.configCenter.fieldPoolMaxPlaceholder"
        />
      </a-form-item>
      <a-form-item field="timeoutMs" :label="t.configCenter.fieldTimeoutMs">
        <a-input-number
          v-model="form.timeoutMs"
          :min="100"
          :max="60000"
          :placeholder="t.configCenter.fieldTimeoutMsPlaceholder"
        />
      </a-form-item>
      <a-form-item field="description" :label="t.configCenter.fieldDbDescription">
        <a-textarea
          v-model="form.description"
          :auto-size="{ minRows: 3, maxRows: 6 }"
          :placeholder="t.configCenter.fieldDbDescriptionPlaceholder"
        />
      </a-form-item>
    </a-form>
  </AppDialog>
</template>

<script setup lang="ts">
import type { DbConnectionItem } from '@entities/config-center';
import { t } from '@shared/i18n';
import { AppButton, AppDialog } from '@shared/ui';

import { useConfigDbEdit } from '../model/useConfigDbEdit';

defineProps<{
  db: DbConnectionItem;
}>();

const emit = defineEmits<{
  success: [];
}>();

const { visible, saving, current, form, open, submit } = useConfigDbEdit();

async function handleSubmit() {
  const succeed = await submit();

  if (succeed) {
    emit('success');
  }

  return succeed;
}
</script>
