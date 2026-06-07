<template>
  <section class="api-definition-debug" data-testid="api-definition-debug-panel">
    <header class="api-definition-debug__header">
      <div>
        <h3 class="api-definition-debug__title">{{ t.apiAutomation.debugSection }}</h3>
        <p class="api-definition-debug__description">
          {{ selectedDefinitionName || t.apiAutomation.emptyDefinitions }}
        </p>
      </div>
      <AppButton
        type="primary"
        :disabled="!definitionId"
        :loading="debugging"
        data-testid="api-debug-send"
        @click="handleDebug"
      >
        {{ t.apiAutomation.send }}
      </AppButton>
    </header>

    <a-alert v-if="errorMessage" type="error" show-icon>
      <template #title>{{ errorMessage }}</template>
    </a-alert>

  </section>
</template>

<script setup lang="ts">
import type { ApiRunResponse } from '@entities/api-automation';
import { t } from '@shared/i18n';
import { AppButton } from '@shared/ui';

import { useApiDefinitionDebug } from '../model/useApiDefinitionDebug';

const props = defineProps<{
  definitionId?: number | string | null;
  selectedDefinitionName?: string;
  environmentId?: number | null;
  variableSetId?: number | null;
}>();

const { debugging, result, errorMessage, debugDefinition } = useApiDefinitionDebug();

const emit = defineEmits<{
  result: [result: ApiRunResponse | null];
}>();

function handleDebug() {
  if (!props.definitionId) {
    return;
  }

  debugDefinition(props.definitionId, props.environmentId, props.variableSetId).then(() => {
    emit('result', result.value);
  });
}
</script>

<style scoped>
.api-definition-debug {
  display: grid;
  gap: var(--app-spacing-md);
  min-width: 0;
}

.api-definition-debug__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--app-spacing-md);
}

.api-definition-debug__title,
.api-definition-debug__description {
  margin: 0;
}

.api-definition-debug__title {
  font-size: 15px;
  font-weight: 650;
}

.api-definition-debug__description {
  margin-top: 4px;
  color: var(--app-color-text-muted);
}

</style>
