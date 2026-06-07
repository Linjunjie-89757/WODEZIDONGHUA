<template>
  <AppButton type="primary" @click="open(bug)">{{ t.bugManagement.transition }}</AppButton>
  <AppDialog
    v-model:visible="visible"
    :title="t.bugManagement.transitionTitle"
    :ok-text="t.common.save"
    :cancel-text="t.common.cancel"
    :confirm-loading="saving"
    :before-ok="handleSubmit"
  >
    <a-form :model="{ toStatus, actionComment }" layout="vertical">
      <a-form-item field="toStatus" :label="t.bugManagement.fieldToStatus" required>
        <a-select v-model="toStatus" :options="options" />
      </a-form-item>
      <a-form-item field="actionComment" :label="t.bugManagement.fieldActionComment">
        <a-textarea
          v-model="actionComment"
          :auto-size="{ minRows: 3, maxRows: 6 }"
          :placeholder="t.bugManagement.fieldActionCommentPlaceholder"
        />
      </a-form-item>
    </a-form>
  </AppDialog>
</template>

<script setup lang="ts">
import type { BugDetail } from '@entities/bug';
import { t } from '@shared/i18n';
import { AppButton, AppDialog } from '@shared/ui';

import { useBugTransition } from '../model/useBugTransition';

defineProps<{
  bug: BugDetail;
}>();

const emit = defineEmits<{
  success: [];
}>();

const { visible, saving, toStatus, actionComment, options, open, submit } = useBugTransition();

async function handleSubmit() {
  const succeed = await submit();

  if (succeed) {
    emit('success');
  }

  return succeed;
}
</script>
