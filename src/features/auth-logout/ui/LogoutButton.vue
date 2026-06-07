<template>
  <AppButton type="text" @click="logout">{{ t.auth.logout }}</AppButton>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { AppButton } from '@shared/ui';

import { useLogout } from '../model/useLogout';

const { logout } = useLogout();
</script>
