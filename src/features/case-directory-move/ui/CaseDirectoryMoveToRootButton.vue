<template>
  <AppButton type="text" :loading="moving" @click="handleMove">
    {{ t.caseCenter.directoryMoveToRoot }}
  </AppButton>
</template>

<script setup lang="ts">
import type { CaseDirectoryNode } from '@entities/case-center';
import { t } from '@shared/i18n';
import { AppButton } from '@shared/ui';

import { useCaseDirectoryMove } from '../model/useCaseDirectoryMove';

const props = defineProps<{
  node: CaseDirectoryNode;
}>();

const emit = defineEmits<{
  success: [];
}>();

const { moving, moveToRoot } = useCaseDirectoryMove();

async function handleMove() {
  const succeed = await moveToRoot(props.node.id, props.node.workspaceCode);

  if (succeed) {
    emit('success');
  }
}
</script>
