<template>
  <AppButton type="text" @click="open(bug)">{{ t.bugManagement.commentAdd }}</AppButton>
  <AppDialog
    v-model:visible="visible"
    :title="t.bugManagement.commentAddTitle"
    :ok-text="t.common.save"
    :cancel-text="t.common.cancel"
    :confirm-loading="saving"
    :before-ok="handleSubmit"
  >
    <a-form :model="{ content }" layout="vertical">
      <a-form-item field="content" :label="t.bugManagement.fieldCommentContent" required>
        <a-textarea
          v-model="content"
          :auto-size="{ minRows: 4, maxRows: 8 }"
          :placeholder="t.bugManagement.fieldCommentContentPlaceholder"
        />
      </a-form-item>
    </a-form>
  </AppDialog>
</template>

<script setup lang="ts">
import type { BugDetail } from '@entities/bug';
import { t } from '@shared/i18n';
import { AppButton, AppDialog } from '@shared/ui';

import { useBugCommentAdd } from '../model/useBugCommentAdd';

defineProps<{
  bug: BugDetail;
}>();

const emit = defineEmits<{
  success: [];
}>();

const { visible, saving, content, open, submit } = useBugCommentAdd();

async function handleSubmit() {
  const succeed = await submit();

  if (succeed) {
    emit('success');
  }

  return succeed;
}
</script>
