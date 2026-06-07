<template>
  <AppCard class="login-page">
    <div class="login-page__header">
      <h1>AutoTestHub</h1>
      <p>{{ t.pages.loginSubtitle }}</p>
    </div>
    <LoginForm />
  </AppCard>
</template>

<script setup lang="ts">
import { LoginForm } from '@features/auth-login';
import { t } from '@shared/i18n';
import { AppCard } from '@shared/ui';
</script>

<style scoped>
.login-page {
  width: min(420px, 100%);
}

.login-page__header {
  margin-bottom: var(--app-spacing-xl);
  text-align: center;
}

.login-page__header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 750;
}

.login-page__header p {
  margin: 8px 0 0;
  color: var(--app-color-text-muted);
}
</style>
