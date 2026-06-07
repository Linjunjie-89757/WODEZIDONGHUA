<template>
  <section class="api-processor-editor" data-testid="api-processor-editor">
    <header class="api-processor-editor__header">
      <div>
        <h3>{{ t.apiAutomation.processorSection }}</h3>
        <p>{{ t.apiAutomation.processorDescription }}</p>
      </div>
      <AppButton type="text" :loading="loadingDbConnections" @click="loadDbConnections">
        {{ t.common.retry }}
      </AppButton>
    </header>

    <a-grid :cols="{ xs: 1, md: 2 }" :col-gap="12" :row-gap="12">
      <a-grid-item>
        <ProcessorStagePanel
          v-model="preProcessors"
          stage="pre"
          :db-connections="dbConnections"
        />
      </a-grid-item>
      <a-grid-item>
        <ProcessorStagePanel
          v-model="postProcessors"
          stage="post"
          :db-connections="dbConnections"
        />
      </a-grid-item>
    </a-grid>
  </section>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, ref, resolveComponent } from 'vue';

import type { ApiProcessorConfig, ApiProcessorType } from '@entities/api-automation';
import { configCenterApi, type DbConnectionItem } from '@entities/config-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';
import { AppButton } from '@shared/ui';

import { createDefaultExtractor, createDefaultProcessor } from '../model/processorFactory';

const preProcessors = defineModel<ApiProcessorConfig[]>('preProcessors', { required: true });
const postProcessors = defineModel<ApiProcessorConfig[]>('postProcessors', { required: true });

const workspaceStore = useWorkspaceStore();
const loadingDbConnections = ref(false);
const dbConnections = ref<DbConnectionItem[]>([]);

async function loadDbConnections() {
  loadingDbConnections.value = true;

  try {
    const page = await configCenterApi.listDbConnections(workspaceStore.currentWorkspace.code);
    dbConnections.value = page.items;
  } catch {
    dbConnections.value = [];
    feedback.warning(t.apiAutomation.processorDbLoadFailed);
  } finally {
    loadingDbConnections.value = false;
  }
}

onMounted(loadDbConnections);

const ProcessorStagePanel = defineComponent({
  name: 'ProcessorStagePanel',
  props: {
    modelValue: {
      type: Array<ApiProcessorConfig>,
      required: true
    },
    stage: {
      type: String,
      required: true
    },
    dbConnections: {
      type: Array<DbConnectionItem>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const title = computed(() =>
      props.stage === 'pre' ? t.apiAutomation.preProcessors : t.apiAutomation.postProcessors
    );
    const addOptions = computed<ApiProcessorType[]>(() =>
      props.stage === 'pre' ? ['SCRIPT', 'SQL', 'TIME_WAITING'] : ['SCRIPT', 'SQL', 'EXTRACT', 'TIME_WAITING']
    );

    function update(next: ApiProcessorConfig[]) {
      emit('update:modelValue', next);
    }

    function patch(index: number, patchValue: Partial<ApiProcessorConfig>) {
      update(
        props.modelValue.map((processor, currentIndex) =>
          currentIndex === index ? { ...processor, ...patchValue } : processor
        )
      );
    }

    function add(type: ApiProcessorType) {
      update([...props.modelValue, createDefaultProcessor(type)]);
    }

    function remove(index: number) {
      update(props.modelValue.filter((_, currentIndex) => currentIndex !== index));
    }

    function addExtractor(index: number) {
      const current = props.modelValue[index];
      patch(index, {
        extractors: [...(current.extractors || []), createDefaultExtractor()]
      });
    }

    function patchExtractor(
      processorIndex: number,
      extractorIndex: number,
      patchValue: Record<string, string | number | boolean>
    ) {
      const current = props.modelValue[processorIndex];
      const extractors = (current.extractors || []).map((extractor, currentIndex) =>
        currentIndex === extractorIndex ? { ...extractor, ...patchValue } : extractor
      );
      patch(processorIndex, { extractors });
    }

    function removeExtractor(processorIndex: number, extractorIndex: number) {
      const current = props.modelValue[processorIndex];
      patch(processorIndex, {
        extractors: (current.extractors || []).filter((_, currentIndex) => currentIndex !== extractorIndex)
      });
    }

    function processorTypeLabel(type: string) {
      const labels: Record<string, string> = {
        SCRIPT: t.apiAutomation.processorTypeScript,
        SQL: t.apiAutomation.processorTypeSql,
        EXTRACT: t.apiAutomation.processorTypeExtract,
        TIME_WAITING: t.apiAutomation.processorTypeWait
      };
      return labels[type] || type;
    }

    function renderProcessor(processor: ApiProcessorConfig, index: number) {
      return h('article', { class: 'api-processor-editor__item' }, [
        h('div', { class: 'api-processor-editor__item-head' }, [
          h('strong', processorTypeLabel(processor.type)),
          h(AppButton, { type: 'text', onClick: () => remove(index) }, () => t.common.delete)
        ]),
        h(
          'div',
          { class: 'api-processor-editor__grid' },
          [
            h(resolveArco('a-input'), {
              modelValue: processor.name,
              'onUpdate:modelValue': (value: string) => patch(index, { name: value }),
              placeholder: t.apiAutomation.processorNamePlaceholder
            }),
            h(resolveArco('a-switch'), {
              modelValue: processor.enabled !== false,
              'onUpdate:modelValue': (value: boolean) => patch(index, { enabled: value })
            })
          ]
        ),
        renderProcessorFields(processor, index)
      ]);
    }

    function renderProcessorFields(processor: ApiProcessorConfig, index: number) {
      if (processor.type === 'SCRIPT') {
        return h(resolveArco('a-textarea'), {
          modelValue: processor.script || '',
          'onUpdate:modelValue': (value: string) => patch(index, { script: value }),
          autoSize: { minRows: 3, maxRows: 6 },
          placeholder: t.apiAutomation.processorScriptPlaceholder,
          'data-testid': `${props.stage}-script-processor-input`
        });
      }

      if (processor.type === 'SQL') {
        return h('div', { class: 'api-processor-editor__stack' }, [
          h(resolveArco('a-select'), {
            modelValue: processor.dataSourceId || undefined,
            'onUpdate:modelValue': (value: number | string) => {
              const selected = props.dbConnections.find((item) => item.id === Number(value));
              patch(index, {
                dataSourceId: value,
                dataSourceName: selected?.connectionName || ''
              });
            },
            placeholder: t.apiAutomation.processorDbPlaceholder,
            allowClear: true,
            'data-testid': `${props.stage}-sql-db-select`
          }, () =>
            props.dbConnections.map((connection) =>
              h(resolveArco('a-option'), { key: connection.id, value: connection.id }, () => connection.connectionName)
            )
          ),
          h(resolveArco('a-textarea'), {
            modelValue: processor.sql || '',
            'onUpdate:modelValue': (value: string) => patch(index, { sql: value }),
            autoSize: { minRows: 3, maxRows: 6 },
            placeholder: t.apiAutomation.processorSqlPlaceholder,
            'data-testid': `${props.stage}-sql-processor-input`
          }),
          h(resolveArco('a-input'), {
            modelValue: processor.resultVariable || '',
            'onUpdate:modelValue': (value: string) => patch(index, { resultVariable: value }),
            placeholder: t.apiAutomation.processorResultVariablePlaceholder
          })
        ]);
      }

      if (processor.type === 'EXTRACT') {
        return h('div', { class: 'api-processor-editor__stack' }, [
          ...(processor.extractors || []).map((extractor, extractorIndex) =>
            h('div', { class: 'api-processor-editor__extractor' }, [
              h(resolveArco('a-input'), {
                modelValue: extractor.variableName,
                'onUpdate:modelValue': (value: string) =>
                  patchExtractor(index, extractorIndex, { variableName: value }),
                placeholder: t.apiAutomation.processorExtractorVariablePlaceholder,
                'data-testid': `${props.stage}-extract-variable-input`
              }),
              h(resolveArco('a-input'), {
                modelValue: extractor.expression,
                'onUpdate:modelValue': (value: string) =>
                  patchExtractor(index, extractorIndex, { expression: value }),
                placeholder: t.apiAutomation.processorExtractorExpressionPlaceholder
              }),
              h(AppButton, { type: 'text', onClick: () => removeExtractor(index, extractorIndex) }, () => t.common.delete)
            ])
          ),
          h(AppButton, { type: 'text', onClick: () => addExtractor(index) }, () => t.apiAutomation.processorExtractorAdd)
        ]);
      }

      return h(resolveArco('a-input-number'), {
        modelValue: processor.delayMs || processor.durationMs || 1000,
        'onUpdate:modelValue': (value: number) => patch(index, { delayMs: value, durationMs: value }),
        min: 0,
        step: 500,
        placeholder: t.apiAutomation.processorWaitPlaceholder,
        'data-testid': `${props.stage}-wait-processor-input`
      });
    }

    function resolveArco(name: string) {
      return resolveComponent(name);
    }

    return () =>
      h('section', { class: 'api-processor-editor__stage' }, [
        h('header', { class: 'api-processor-editor__stage-head' }, [
          h('h4', title.value),
          h(resolveArco('a-dropdown'), {}, {
            content: () =>
              addOptions.value.map((type) =>
                h(resolveArco('a-doption'), { key: type, onClick: () => add(type) }, () => processorTypeLabel(type))
              ),
            default: () => h(AppButton, { type: 'text' }, () => t.apiAutomation.processorAdd)
          })
        ]),
        props.modelValue.length
          ? props.modelValue.map((processor, index) => renderProcessor(processor, index))
          : h('p', { class: 'api-processor-editor__empty' }, t.apiAutomation.processorEmpty)
      ]);
  }
});
</script>

<style scoped>
.api-processor-editor,
.api-processor-editor__stage,
.api-processor-editor__stack {
  display: grid;
  gap: var(--app-spacing-sm);
  min-width: 0;
}

.api-processor-editor__header,
.api-processor-editor__stage-head,
.api-processor-editor__item-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--app-spacing-sm);
  min-width: 0;
}

.api-processor-editor__header h3,
.api-processor-editor__header p,
.api-processor-editor__stage-head h4 {
  margin: 0;
}

.api-processor-editor__header h3,
.api-processor-editor__stage-head h4 {
  color: var(--app-color-text);
  font-size: 14px;
  font-weight: 650;
}

.api-processor-editor__header p,
.api-processor-editor__empty {
  color: var(--app-color-text-muted);
}

.api-processor-editor__stage,
.api-processor-editor__item,
.api-processor-editor__extractor {
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: var(--app-color-surface);
  padding: var(--app-spacing-sm);
}

.api-processor-editor__item {
  display: grid;
  gap: var(--app-spacing-sm);
}

.api-processor-editor__grid,
.api-processor-editor__extractor {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--app-spacing-sm);
  align-items: center;
  min-width: 0;
}

.api-processor-editor__extractor {
  grid-template-columns: minmax(120px, 0.8fr) minmax(160px, 1fr) auto;
}

@media (max-width: 720px) {
  .api-processor-editor__grid,
  .api-processor-editor__extractor {
    grid-template-columns: 1fr;
  }
}
</style>
