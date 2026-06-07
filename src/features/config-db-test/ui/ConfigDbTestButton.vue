<template>
  <AppButton type="text" :loading="testing" @click="handleTest">
    {{ t.configCenter.test }}
  </AppButton>
</template>

<script setup lang="ts">
import type { DbConnectionItem } from '@entities/config-center';
import { t } from '@shared/i18n';
import { AppButton } from '@shared/ui';

import { useConfigDbTest } from '../model/useConfigDbTest';

const props = defineProps<{
  db: DbConnectionItem;
}>();

const { testing, testDbConnection } = useConfigDbTest();

function handleTest() {
  testDbConnection(props.db);
}
</script>
