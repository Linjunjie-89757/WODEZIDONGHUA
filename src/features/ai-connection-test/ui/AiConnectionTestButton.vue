<template>
  <AppButton type="text" :loading="loading" @click="testConnection(connectionId)">
    {{ t.aiConnection.test }}
  </AppButton>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { AppButton } from '@shared/ui';

import { useAiConnectionTest } from '../model/useAiConnectionTest';

defineProps<{
  connectionId: number | string;
}>();

const { loading, testConnection } = useAiConnectionTest();
</script>
