<template>
  <a-form :model="form" layout="vertical" @submit-success="submit">
    <a-form-item field="username" :label="t.auth.account" required>
      <a-input v-model="form.username" :placeholder="t.auth.accountPlaceholder" />
    </a-form-item>
    <a-form-item field="password" :label="t.auth.password" required>
      <a-input-password v-model="form.password" :placeholder="t.auth.passwordPlaceholder" />
    </a-form-item>
    <AppButton long type="primary" :loading="loading" @click="submit">
      {{ t.auth.login }}
    </AppButton>
  </a-form>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { AppButton } from '@shared/ui';

import { useLogin } from '../model/useLogin';

const { form, loading, submit } = useLogin();
</script>
