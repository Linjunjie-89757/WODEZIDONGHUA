<template>
  <AppSection
    :title="t.apiAutomation.overviewTitle"
    :description="t.apiAutomation.overviewDescription"
    class="api-automation-shell"
    data-testid="api-automation-shell"
  >
    <template #actions>
      <AppButton type="text" :loading="loading" @click="loadReadonly">
        {{ t.apiAutomation.retry }}
      </AppButton>
    </template>

    <AppLoadingState v-if="loading" />
    <a-alert v-else-if="errorMessage" type="error" show-icon>
      <template #title>{{ errorMessage }}</template>
      <AppButton type="text" @click="loadReadonly">{{ t.common.retry }}</AppButton>
    </a-alert>
    <div v-else class="api-automation-shell__workbench" data-testid="api-automation-workbench">
      <header class="api-automation-shell__toolbar">
        <div class="api-automation-shell__metrics" aria-label="api automation metrics">
          <span>{{ t.apiAutomation.definitionTotal }} <strong>{{ summary.definitionTotal }}</strong></span>
          <span>{{ t.apiAutomation.moduleTotal }} <strong>{{ summary.moduleTotal }}</strong></span>
          <span>{{ t.apiAutomation.environmentTotal }} <strong>{{ summary.environmentTotal }}</strong></span>
          <span>{{ t.apiAutomation.variableSetTotal }} <strong>{{ summary.variableSetTotal }}</strong></span>
        </div>
        <div class="api-automation-shell__context" data-testid="api-run-context-toolbar">
          <span class="api-automation-shell__context-label">{{ t.apiAutomation.runContextSection }}</span>
          <a-select
            v-model="selectedEnvironmentId"
            allow-clear
            data-testid="api-environment-select"
            :placeholder="t.apiAutomation.environmentDefault"
          >
            <a-option v-for="environment in environments" :key="environment.id" :value="environment.id">
              {{ environment.name }}
            </a-option>
          </a-select>
          <a-select
            v-model="selectedVariableSetId"
            allow-clear
            data-testid="api-variable-set-select"
            :placeholder="t.apiAutomation.variableSetDefault"
          >
            <a-option v-for="variableSet in variableSets" :key="variableSet.id" :value="variableSet.id">
              {{ variableSet.name }}
            </a-option>
          </a-select>
        </div>
      </header>

      <a-tabs
        v-model:active-key="activeWorkbenchTab"
        class="api-automation-shell__tabs"
        data-testid="api-automation-workbench-tabs"
      >
        <a-tab-pane key="definitions" :title="t.apiAutomation.workbenchTabDefinitions">
          <div class="api-automation-shell__definition-workbench">
            <aside class="api-automation-shell__rail">
              <section class="api-automation-shell__panel">
                <div class="api-automation-shell__panel-header">
                  <h3 class="api-automation-shell__panel-title">{{ t.apiAutomation.modulesSection }}</h3>
                  <span>{{ summary.moduleTotal }}</span>
                </div>
                <ApiDefinitionModuleTree :modules="definitionModules" />
              </section>
            </aside>

            <main class="api-automation-shell__editor">
              <section class="api-automation-shell__panel api-automation-shell__definition-list-panel">
                <header class="api-automation-shell__panel-header">
                  <div>
                    <h3 class="api-automation-shell__panel-title">{{ t.apiAutomation.definitionsSection }}</h3>
                    <p>{{ t.apiAutomation.definitionWorkbenchHint }}</p>
                  </div>
                  <AppButton type="primary" data-testid="api-definition-create" @click="openCreateDialog">
                    {{ t.apiAutomation.create }}
                  </AppButton>
                </header>
                <ApiDefinitionList
                  :definitions="definitions"
                  :selected-id="selectedDefinitionId"
                  @select="selectDefinition"
                  @edit="openEditDialog"
                  @success="loadReadonly"
                />
              </section>

              <section class="api-automation-shell__request-editor" data-testid="api-definition-request-editor">
                <div class="api-automation-shell__editor-tabs" data-testid="api-definition-editor-tabs">
                  <button
                    type="button"
                    class="api-automation-shell__editor-tab api-automation-shell__editor-tab--active"
                  >
                    <span class="api-automation-shell__method-chip">{{ selectedDefinition?.method || 'HTTP' }}</span>
                    <span>{{ selectedDefinition?.name || t.apiAutomation.requestEditorEmptyTitle }}</span>
                  </button>
                  <button type="button" class="api-automation-shell__tab-action" @click="openCreateDialog">
                    +
                  </button>
                </div>

                <div
                  :class="[
                    'api-automation-shell__request-shell',
                    { 'api-automation-shell__request-shell--wide': activeRequestContentTab === 'cases' }
                  ]"
                >
                  <section class="api-automation-shell__request-pane">
                    <div class="api-automation-shell__command-row" data-testid="api-definition-command-row">
                      <div class="api-automation-shell__url-compose">
                        <a-select
                          v-if="definitionEditorForm"
                          v-model="definitionEditorForm.method"
                          class="api-automation-shell__method-select"
                          data-testid="api-definition-inline-method-select"
                        >
                          <a-option v-for="method in requestMethods" :key="method" :value="method">
                            {{ method }}
                          </a-option>
                        </a-select>
                        <span v-else class="api-automation-shell__method-select">
                          {{ selectedDefinition?.method || '-' }}
                        </span>
                        <a-input
                          v-if="definitionEditorForm"
                          v-model="definitionEditorForm.path"
                          class="api-automation-shell__url-input"
                          data-testid="api-definition-inline-path-input"
                          :placeholder="t.apiAutomation.fieldPathPlaceholder"
                        />
                        <span v-else class="api-automation-shell__url-input">
                          {{ selectedDefinition?.path || t.apiAutomation.requestEditorEmptyPath }}
                        </span>
                      </div>
                      <AppButton
                        type="primary"
                        :disabled="!selectedDefinitionId"
                        :loading="debugging"
                        data-testid="api-debug-send"
                        @click="handleDebugDefinition"
                      >
                        {{ t.apiAutomation.send }}
                      </AppButton>
                      <AppButton
                        :disabled="!selectedDefinitionId"
                        :loading="saving"
                        data-testid="api-definition-command-edit"
                        @click="handleSaveInlineDefinition"
                      >
                        {{ t.apiAutomation.save }}
                      </AppButton>
                      <AppButton
                        :disabled="!selectedDefinitionId"
                        type="text"
                        data-testid="api-definition-command-dialog-edit"
                        @click="selectedDefinitionId && openEditDialog(selectedDefinitionId)"
                      >
                        {{ t.apiAutomation.edit }}
                      </AppButton>
                    </div>

                    <a-alert v-if="debugErrorMessage" type="error" show-icon>
                      <template #title>{{ debugErrorMessage }}</template>
                    </a-alert>

                    <a-spin :loading="definitionDetailLoading">
                    <a-empty
                      v-if="!definitionEditorForm"
                      :description="t.apiAutomation.requestEditorEmptyPath"
                    />
                    <a-tabs
                      v-else
                      v-model:active-key="activeRequestContentTab"
                      class="api-automation-shell__request-tabs"
                      data-testid="api-definition-content-tabs"
                    >
                      <a-tab-pane key="headers" :title="t.apiAutomation.requestTabHeaders">
                        <section
                          class="api-automation-shell__editor-surface api-automation-shell__kv-editor"
                          data-testid="api-definition-headers-editor"
                        >
                          <header class="api-automation-shell__surface-header">
                            <strong>{{ t.apiAutomation.requestTabHeaders }}</strong>
                            <span>{{ t.apiAutomation.requestEditorMultiRowHint }}</span>
                          </header>
                          <div class="api-automation-shell__kv-table-header api-automation-shell__kv-table-header--header">
                            <span>{{ t.apiAutomation.enabled }}</span>
                            <span>{{ t.apiAutomation.fieldHeaderKey }}</span>
                            <span>{{ t.apiAutomation.fieldHeaderValue }}</span>
                            <span>{{ t.apiAutomation.fieldDescription }}</span>
                            <span></span>
                          </div>
                          <div
                            v-for="(row, index) in definitionEditorForm.headers"
                            :key="`header-${index}`"
                            class="api-automation-shell__kv-table-row api-automation-shell__kv-table-row--header"
                            data-testid="api-definition-header-row"
                          >
                            <a-switch v-model="row.enabled" size="small" />
                            <a-input
                              v-model="row.key"
                              data-testid="api-definition-inline-header-key-input"
                            />
                            <a-input
                              v-model="row.value"
                              data-testid="api-definition-inline-header-value-input"
                            />
                            <a-input v-model="row.description" />
                            <AppButton type="text" status="danger" @click="removeKeyValueRow(definitionEditorForm.headers, index)">
                              {{ t.common.delete }}
                            </AppButton>
                          </div>
                          <AppButton type="text" data-testid="api-definition-header-add-row" @click="addKeyValueRow(definitionEditorForm.headers)">
                            {{ t.apiAutomation.addRow }}
                          </AppButton>
                        </section>
                      </a-tab-pane>
                      <a-tab-pane key="body" :title="t.apiAutomation.requestTabBody">
                        <section
                          class="api-automation-shell__editor-surface"
                          data-testid="api-definition-body-editor"
                        >
                          <header class="api-automation-shell__surface-header">
                            <strong>{{ t.apiAutomation.fieldRawBody }}</strong>
                            <span>{{ t.apiAutomation.requestEditorRawBodyMode }}</span>
                          </header>
                          <div class="api-automation-shell__body-mode-row">
                            <button
                              type="button"
                              :class="[
                                'api-automation-shell__body-mode',
                                { 'api-automation-shell__body-mode--active': definitionEditorForm.bodyType === 'RAW' }
                              ]"
                              data-testid="api-definition-body-mode-raw"
                              @click="definitionEditorForm.bodyType = 'RAW'"
                            >
                              raw
                            </button>
                            <button
                              type="button"
                              :class="[
                                'api-automation-shell__body-mode',
                                { 'api-automation-shell__body-mode--active': definitionEditorForm.bodyType === 'FORM_URLENCODED' }
                              ]"
                              data-testid="api-definition-body-mode-form"
                              @click="definitionEditorForm.bodyType = 'FORM_URLENCODED'"
                            >
                              x-www-form-urlencoded
                            </button>
                            <button
                              type="button"
                              :class="[
                                'api-automation-shell__body-mode',
                                { 'api-automation-shell__body-mode--active': definitionEditorForm.bodyType === 'NONE' }
                              ]"
                              data-testid="api-definition-body-mode-none"
                              @click="definitionEditorForm.bodyType = 'NONE'"
                            >
                              none
                            </button>
                          </div>
                          <a-textarea
                            v-if="definitionEditorForm.bodyType === 'RAW'"
                            v-model="definitionEditorForm.rawBody"
                            data-testid="api-definition-inline-body-input"
                            :auto-size="{ minRows: 8, maxRows: 14 }"
                            :placeholder="t.apiAutomation.fieldRawBodyPlaceholder"
                          />
                          <div
                            v-else-if="definitionEditorForm.bodyType === 'FORM_URLENCODED'"
                            class="api-automation-shell__kv-editor"
                          >
                            <div class="api-automation-shell__kv-table-header api-automation-shell__kv-table-header--body">
                              <span>{{ t.apiAutomation.enabled }}</span>
                              <span>{{ t.apiAutomation.fieldQueryKey }}</span>
                              <span>{{ t.apiAutomation.fieldQueryValue }}</span>
                              <span>{{ t.apiAutomation.fieldDescription }}</span>
                              <span></span>
                            </div>
                            <div
                              v-for="(row, index) in definitionEditorForm.bodyFormItems"
                              :key="`body-form-${index}`"
                              class="api-automation-shell__kv-table-row api-automation-shell__kv-table-row--body"
                              data-testid="api-definition-body-form-row"
                            >
                              <a-switch v-model="row.enabled" size="small" />
                              <a-input v-model="row.key" />
                              <a-input v-model="row.value" />
                              <a-input v-model="row.description" />
                              <AppButton type="text" status="danger" @click="removeKeyValueRow(definitionEditorForm.bodyFormItems, index)">
                                {{ t.common.delete }}
                              </AppButton>
                            </div>
                            <AppButton type="text" data-testid="api-definition-body-form-add-row" @click="addKeyValueRow(definitionEditorForm.bodyFormItems)">
                              {{ t.apiAutomation.addRow }}
                            </AppButton>
                          </div>
                          <div v-else class="api-automation-shell__compact-empty">
                            {{ t.apiAutomation.bodyNoneHint }}
                          </div>
                        </section>
                      </a-tab-pane>
                      <a-tab-pane key="params" title="Params">
                        <section
                          class="api-automation-shell__editor-surface api-automation-shell__kv-editor"
                          data-testid="api-definition-params-editor"
                        >
                          <header class="api-automation-shell__surface-header">
                            <strong>Params</strong>
                            <span>{{ t.apiAutomation.requestEditorMultiRowHint }}</span>
                          </header>
                          <div class="api-automation-shell__kv-table-header api-automation-shell__kv-table-header--query">
                            <span>{{ t.apiAutomation.enabled }}</span>
                            <span>{{ t.apiAutomation.fieldQueryKey }}</span>
                            <span>{{ t.apiAutomation.fieldQueryValue }}</span>
                            <span>{{ t.apiAutomation.fieldDescription }}</span>
                            <span></span>
                          </div>
                          <div
                            v-for="(row, index) in definitionEditorForm.queryParams"
                            :key="`query-${index}`"
                            class="api-automation-shell__kv-table-row api-automation-shell__kv-table-row--query"
                            data-testid="api-definition-query-row"
                          >
                            <a-switch v-model="row.enabled" size="small" />
                            <a-input
                              v-model="row.key"
                              data-testid="api-definition-inline-query-key-input"
                            />
                            <a-input
                              v-model="row.value"
                              data-testid="api-definition-inline-query-value-input"
                            />
                            <a-input v-model="row.description" />
                            <AppButton type="text" status="danger" @click="removeKeyValueRow(definitionEditorForm.queryParams, index)">
                              {{ t.common.delete }}
                            </AppButton>
                          </div>
                          <AppButton type="text" data-testid="api-definition-query-add-row" @click="addKeyValueRow(definitionEditorForm.queryParams)">
                            {{ t.apiAutomation.addRow }}
                          </AppButton>
                        </section>
                      </a-tab-pane>
                      <a-tab-pane key="auth" title="Auth">
                        <section
                          class="api-automation-shell__editor-surface api-automation-shell__auth-editor"
                          data-testid="api-definition-auth-editor"
                        >
                          <header class="api-automation-shell__surface-header">
                            <strong>{{ t.apiAutomation.authMode }}</strong>
                            <span>{{ t.apiAutomation.authModeHint }}</span>
                          </header>
                          <a-radio-group
                            v-model="definitionEditorForm.authConfig.authType"
                            type="button"
                            data-testid="api-definition-auth-type"
                          >
                            <a-radio value="NONE">No Auth</a-radio>
                            <a-radio value="BASIC">Basic Auth</a-radio>
                            <a-radio value="DIGEST">Digest Auth</a-radio>
                          </a-radio-group>
                          <div
                            v-if="definitionEditorForm.authConfig.authType === 'BASIC'"
                            class="api-automation-shell__auth-fields"
                          >
                            <a-input
                              v-model="definitionEditorForm.authConfig.basicAuth.userName"
                              data-testid="api-definition-auth-basic-username"
                              placeholder="username"
                            />
                            <a-input-password
                              v-model="definitionEditorForm.authConfig.basicAuth.password"
                              data-testid="api-definition-auth-basic-password"
                              placeholder="password"
                            />
                          </div>
                          <div
                            v-else-if="definitionEditorForm.authConfig.authType === 'DIGEST'"
                            class="api-automation-shell__auth-fields"
                          >
                            <a-input
                              v-model="definitionEditorForm.authConfig.digestAuth.userName"
                              data-testid="api-definition-auth-digest-username"
                              placeholder="username"
                            />
                            <a-input-password
                              v-model="definitionEditorForm.authConfig.digestAuth.password"
                              data-testid="api-definition-auth-digest-password"
                              placeholder="password"
                            />
                          </div>
                        </section>
                      </a-tab-pane>
                      <a-tab-pane key="pre" :title="t.apiAutomation.requestTabPre">
                        <section
                          class="api-automation-shell__editor-surface"
                          data-testid="api-definition-pre-editor"
                        >
                          <ApiDefinitionProcessorEditor
                            v-model:pre-processors="definitionEditorForm.preProcessors"
                            v-model:post-processors="emptyPostProcessors"
                          />
                        </section>
                      </a-tab-pane>
                      <a-tab-pane key="post" :title="t.apiAutomation.requestTabPost">
                        <section
                          class="api-automation-shell__editor-surface"
                          data-testid="api-definition-post-editor"
                        >
                          <ApiDefinitionProcessorEditor
                            v-model:pre-processors="emptyPreProcessors"
                            v-model:post-processors="definitionEditorForm.postProcessors"
                          />
                        </section>
                      </a-tab-pane>
                      <a-tab-pane key="tests" :title="t.apiAutomation.requestTabTests">
                        <section
                          class="api-automation-shell__editor-surface"
                          data-testid="api-definition-tests-editor"
                        >
                          <ApiDefinitionAssertionEditor v-model="definitionEditorForm.assertions" />
                        </section>
                      </a-tab-pane>
                      <a-tab-pane key="settings" :title="t.apiAutomation.requestTabSettings">
                        <section
                          class="api-automation-shell__editor-surface api-automation-shell__settings-editor"
                          data-testid="api-definition-settings-editor"
                        >
                          <a-grid :cols="{ xs: 1, md: 2 }" :col-gap="12" :row-gap="10">
                            <a-grid-item>
                              <a-form-item :label="t.apiAutomation.fieldName">
                                <a-input v-model="definitionEditorForm.name" />
                              </a-form-item>
                            </a-grid-item>
                            <a-grid-item>
                              <a-form-item :label="t.apiAutomation.fieldDirectory">
                                <a-input v-model="definitionEditorForm.directoryName" />
                              </a-form-item>
                            </a-grid-item>
                            <a-grid-item>
                              <a-form-item :label="t.apiAutomation.fieldTimeout">
                                <a-input-number
                                  v-model="definitionEditorForm.timeoutMs"
                                  data-testid="api-definition-inline-timeout-input"
                                  :min="1000"
                                  :step="1000"
                                />
                              </a-form-item>
                            </a-grid-item>
                            <a-grid-item :span="2">
                              <a-form-item :label="t.apiAutomation.fieldDescription">
                                <a-textarea
                                  v-model="definitionEditorForm.description"
                                  :auto-size="{ minRows: 2, maxRows: 4 }"
                                />
                              </a-form-item>
                            </a-grid-item>
                          </a-grid>
                        </section>
                      </a-tab-pane>
                      <a-tab-pane key="cases" :title="t.apiAutomation.workbenchTabCases">
                        <section
                          class="api-automation-shell__editor-surface api-automation-shell__cases-editor"
                          data-testid="api-definition-cases-editor"
                        >
                          <ApiCaseManagement
                            :definition-id="selectedDefinitionId"
                            :selected-definition-name="selectedDefinition?.name || ''"
                            :environment-id="selectedEnvironmentId"
                            :variable-set-id="selectedVariableSetId"
                          />
                        </section>
                      </a-tab-pane>
                    </a-tabs>
                    </a-spin>
                  </section>

                  <aside
                    v-if="activeRequestContentTab !== 'cases'"
                    class="api-automation-shell__response-shell"
                    data-testid="api-definition-response-shell"
                  >
                    <header class="api-automation-shell__response-header">
                      <strong>{{ t.apiAutomation.responseShellTitle }}</strong>
                      <span>{{ definitionRunResult?.result || t.apiAutomation.responseShellEmpty }}</span>
                    </header>
                    <ApiRunResultPanel v-if="definitionRunResult" :result="definitionRunResult" />
                    <div v-else class="api-automation-shell__response-empty">
                      {{ t.apiAutomation.responseShellHint }}
                    </div>
                  </aside>
                </div>
              </section>
            </main>
          </div>
        </a-tab-pane>

        <a-tab-pane key="cases" :title="t.apiAutomation.workbenchTabCases">
          <section class="api-automation-shell__tab-surface" data-testid="api-automation-cases-tab">
            <ApiCaseManagement
              :definition-id="selectedDefinitionId"
              :selected-definition-name="selectedDefinition?.name || ''"
              :environment-id="selectedEnvironmentId"
              :variable-set-id="selectedVariableSetId"
            />
          </section>
        </a-tab-pane>

        <a-tab-pane key="scenarios" :title="t.apiAutomation.workbenchTabScenarios">
          <section class="api-automation-shell__tab-surface" data-testid="api-automation-scenarios-tab">
            <ApiScenarioManagement
              :definitions="definitions"
              :environments="environments"
              :variable-sets="variableSets"
              :environment-id="selectedEnvironmentId"
              :variable-set-id="selectedVariableSetId"
            />
          </section>
        </a-tab-pane>
      </a-tabs>
    </div>
    <ApiDefinitionDialog
      ref="definitionDialogRef"
      :mode="dialogMode"
      :definition-id="editingDefinitionId"
      @success="loadReadonly"
    />
  </AppSection>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

import {
  apiAutomationApi,
  createDefinitionEditForm,
  type ApiDefinitionFormValues,
  type ApiKeyValue,
  type ApiProcessorConfig,
  type ApiRunResponse
} from '@entities/api-automation';
import { useWorkspaceStore } from '@entities/workspace';
import { useApiDefinitionDebug } from '@features/api-definition-debug';
import { ApiDefinitionAssertionEditor } from '@features/api-definition-assertions';
import { ApiDefinitionProcessorEditor } from '@features/api-definition-processors';
import { ApiDefinitionDialog, useApiDefinitionSave } from '@features/api-definition-save';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';
import { AppButton, AppLoadingState, AppSection } from '@shared/ui';
import { ApiCaseManagement } from '@widgets/api-case-management';
import { ApiRunResultPanel } from '@widgets/api-run-result-panel';
import { ApiScenarioManagement } from '@widgets/api-scenario-management';

import { useApiAutomationShell } from '../model/useApiAutomationShell';
import ApiDefinitionList from './ApiDefinitionList.vue';
import ApiDefinitionModuleTree from './ApiDefinitionModuleTree.vue';

const {
  loading,
  errorMessage,
  definitions,
  definitionModules,
  environments,
  variableSets,
  selectedDefinition,
  selectedDefinitionId,
  selectedEnvironmentId,
  selectedVariableSetId,
  summary,
  loadReadonly,
  selectDefinition
} = useApiAutomationShell();

const workspaceStore = useWorkspaceStore();
const { debugging, result, errorMessage: debugErrorMessage, debugDefinition } = useApiDefinitionDebug();
const { saving, saveDefinition } = useApiDefinitionSave();
const dialogMode = ref<'create' | 'edit'>('create');
const activeWorkbenchTab = ref('definitions');
const activeRequestContentTab = ref('headers');
const editingDefinitionId = ref<number | null>(null);
const definitionRunResult = ref<ApiRunResponse | null>(null);
const definitionDetailLoading = ref(false);
const definitionEditorForm = ref<ApiDefinitionFormValues | null>(null);
const emptyPreProcessors = ref<ApiProcessorConfig[]>([]);
const emptyPostProcessors = ref<ApiProcessorConfig[]>([]);
const requestMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'] as const;
const definitionDialogRef = ref<{
  openCreate: () => void;
  openEdit: () => void | Promise<void>;
} | null>(null);

watch(
  selectedDefinitionId,
  (id) => {
    void loadDefinitionDetail(id);
  },
  { immediate: true }
);

async function openCreateDialog() {
  dialogMode.value = 'create';
  editingDefinitionId.value = null;
  await nextTick();
  definitionDialogRef.value?.openCreate();
}

async function openEditDialog(id: number) {
  dialogMode.value = 'edit';
  editingDefinitionId.value = id;
  await nextTick();
  await definitionDialogRef.value?.openEdit();
}

async function loadDefinitionDetail(id?: number | null) {
  definitionEditorForm.value = null;
  definitionRunResult.value = null;

  if (!id) {
    return;
  }

  definitionDetailLoading.value = true;

  try {
    const detail = await apiAutomationApi.getDefinitionDetail(
      id,
      workspaceStore.currentWorkspace.code
    );
    definitionEditorForm.value = createDefinitionEditForm(detail);
  } catch {
    feedback.error(t.apiAutomation.detailLoadFailed);
  } finally {
    definitionDetailLoading.value = false;
  }
}

async function handleSaveInlineDefinition() {
  if (!selectedDefinitionId.value || !definitionEditorForm.value) {
    return;
  }

  const succeed = await saveDefinition(definitionEditorForm.value, selectedDefinitionId.value);

  if (!succeed) {
    return;
  }

  await loadReadonly();
  await loadDefinitionDetail(selectedDefinitionId.value);
}

function addKeyValueRow(rows: ApiKeyValue[]) {
  rows.push({
    key: '',
    value: '',
    description: '',
    enabled: true
  });
}

function removeKeyValueRow(rows: ApiKeyValue[], index: number) {
  rows.splice(index, 1);

  if (!rows.length) {
    addKeyValueRow(rows);
  }
}

async function handleDebugDefinition() {
  if (!selectedDefinitionId.value) {
    return;
  }

  await debugDefinition(
    selectedDefinitionId.value,
    selectedEnvironmentId.value,
    selectedVariableSetId.value
  );
  definitionRunResult.value = result.value;
}
</script>

<style scoped>
.api-automation-shell :deep(.app-section__header) {
  align-items: center;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-md);
  background: var(--app-color-surface);
  padding: 10px 12px;
}

.api-automation-shell :deep(.app-section__title) {
  font-size: 16px;
}

.api-automation-shell :deep(.app-section__description) {
  margin-top: 2px;
  font-size: 13px;
  line-height: 1.45;
}

.api-automation-shell__workbench {
  display: grid;
  min-width: 0;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-md);
  background: var(--app-color-surface);
  overflow: hidden;
}

.api-automation-shell__toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(420px, 560px);
  gap: 12px;
  align-items: center;
  min-width: 0;
  border-bottom: 1px solid var(--app-color-border);
  background: #f8fafc;
  padding: 10px 12px;
}

.api-automation-shell__metrics {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}

.api-automation-shell__metrics span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: #ffffff;
  color: var(--app-color-text-muted);
  font-size: 12px;
  padding: 0 9px;
}

.api-automation-shell__metrics strong {
  color: var(--app-color-text);
  font-size: 13px;
  font-weight: 650;
}

.api-automation-shell__context {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) minmax(0, 1fr);
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.api-automation-shell__context-label {
  color: var(--app-color-text-muted);
  font-size: 12px;
  white-space: nowrap;
}

.api-automation-shell__context :deep(.arco-select-view-single) {
  min-height: 30px;
}

.api-automation-shell__tabs :deep(.arco-tabs-nav) {
  margin: 0;
  border-bottom: 1px solid var(--app-color-border);
  padding: 0 12px;
}

.api-automation-shell__tabs :deep(.arco-tabs-tab) {
  height: 40px;
  margin: 0;
  padding: 0 14px;
}

.api-automation-shell__tabs :deep(.arco-tabs-content) {
  padding-top: 0;
}

.api-automation-shell__definition-workbench {
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  min-width: 0;
  min-height: 620px;
}

.api-automation-shell__rail {
  min-width: 0;
  border-right: 1px solid var(--app-color-border);
  background: #fbfcfe;
  padding: 10px;
}

.api-automation-shell__editor {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 0;
  min-width: 0;
}

.api-automation-shell__tab-surface {
  min-width: 0;
  min-height: 620px;
  padding: 12px;
}

.api-automation-shell__panel {
  display: grid;
  gap: 10px;
  min-width: 0;
  padding: 10px;
}

.api-automation-shell__definition-list-panel {
  border-bottom: 1px solid var(--app-color-border);
}

.api-automation-shell__request-editor {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-width: 0;
  min-height: 430px;
  background: #ffffff;
}

.api-automation-shell__editor-tabs {
  display: flex;
  align-items: center;
  min-width: 0;
  border-bottom: 1px solid var(--app-color-border);
  background: #f8fafc;
}

.api-automation-shell__editor-tab,
.api-automation-shell__tab-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  min-width: 0;
  border: 0;
  border-right: 1px solid var(--app-color-border);
  background: transparent;
  color: var(--app-color-text-muted);
  cursor: pointer;
  font-size: 13px;
  padding: 0 12px;
}

.api-automation-shell__editor-tab {
  max-width: 320px;
}

.api-automation-shell__editor-tab span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-automation-shell__editor-tab--active {
  background: #ffffff;
  color: var(--app-color-text);
}

.api-automation-shell__tab-action {
  width: 34px;
  justify-content: center;
  color: rgb(var(--primary-6));
  font-size: 18px;
}

.api-automation-shell__method-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  height: 20px;
  border-radius: var(--app-radius-sm);
  background: rgba(var(--primary-6), 0.1);
  color: rgb(var(--primary-7));
  font-size: 11px;
  font-weight: 650;
}

.api-automation-shell__request-shell {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(300px, 0.9fr);
  min-width: 0;
  min-height: 0;
}

.api-automation-shell__request-shell--wide {
  grid-template-columns: minmax(0, 1fr);
}

.api-automation-shell__request-pane,
.api-automation-shell__response-shell {
  display: grid;
  align-content: start;
  gap: 10px;
  min-width: 0;
  padding: 12px;
}

.api-automation-shell__request-pane {
  border-right: 1px solid var(--app-color-border);
}

.api-automation-shell__command-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto auto;
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.api-automation-shell__url-compose {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: #ffffff;
}

.api-automation-shell__method-select,
.api-automation-shell__url-input {
  display: flex;
  align-items: center;
  min-height: 32px;
  min-width: 0;
  font-size: 13px;
}

.api-automation-shell__method-select {
  justify-content: center;
  border-right: 1px solid var(--app-color-border);
  background: #f8fafc;
  color: rgb(var(--primary-7));
  font-weight: 650;
}

.api-automation-shell__method-select :deep(.arco-select-view-single) {
  min-height: 32px;
  border: 0;
  border-radius: 0;
  background: #f8fafc;
  color: rgb(var(--primary-7));
  font-weight: 650;
}

.api-automation-shell__url-input {
  overflow: hidden;
  color: var(--app-color-text);
  padding: 0 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-automation-shell__url-input :deep(.arco-input-wrapper) {
  min-height: 32px;
  border: 0;
  border-radius: 0;
  background: #ffffff;
  padding-left: 10px;
}

.api-automation-shell__request-tabs :deep(.arco-tabs-nav) {
  margin: 0;
}

.api-automation-shell__request-tabs :deep(.arco-tabs-tab) {
  height: 34px;
  margin: 0;
  padding: 0 10px;
  font-size: 13px;
}

.api-automation-shell__request-tabs :deep(.arco-tabs-content) {
  padding-top: 0;
}

.api-automation-shell__tab-placeholder,
.api-automation-shell__response-empty {
  display: grid;
  gap: 6px;
  min-height: 180px;
  align-content: center;
  justify-items: center;
  border: 1px dashed var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: #fbfcfe;
  color: var(--app-color-text-muted);
  padding: 18px;
  text-align: center;
}

.api-automation-shell__tab-placeholder strong {
  color: var(--app-color-text);
  font-size: 14px;
}

.api-automation-shell__tab-placeholder p {
  max-width: 360px;
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
}

.api-automation-shell__editor-surface {
  display: grid;
  gap: 10px;
  min-width: 0;
  min-height: 220px;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: #ffffff;
  padding: 10px;
}

.api-automation-shell__surface-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
  border-bottom: 1px solid var(--app-color-border);
  padding-bottom: 8px;
}

.api-automation-shell__surface-header strong {
  color: var(--app-color-text);
  font-size: 13px;
  font-weight: 650;
}

.api-automation-shell__surface-header span {
  overflow: hidden;
  color: var(--app-color-text-muted);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-automation-shell__kv-editor {
  align-content: start;
  overflow-x: auto;
}

.api-automation-shell__kv-header,
.api-automation-shell__kv-row {
  display: grid;
  grid-template-columns: minmax(140px, 0.8fr) minmax(180px, 1fr);
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.api-automation-shell__kv-header {
  min-height: 30px;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: #f8fafc;
  color: var(--app-color-text-muted);
  font-size: 12px;
  padding: 0 8px;
}

.api-automation-shell__kv-table-header,
.api-automation-shell__kv-table-row {
  display: grid;
  gap: 8px;
  align-items: center;
  min-width: 0;
  border-bottom: 1px solid var(--app-color-border);
  padding: 6px 8px;
}

.api-automation-shell__kv-table-header {
  min-height: 32px;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm) var(--app-radius-sm) 0 0;
  background: #f8fafc;
  color: var(--app-color-text-muted);
  font-size: 12px;
  font-weight: 600;
}

.api-automation-shell__kv-table-row {
  border-right: 1px solid var(--app-color-border);
  border-left: 1px solid var(--app-color-border);
  background: #ffffff;
}

.api-automation-shell__kv-table-row:hover {
  background: #fbfdff;
}

.api-automation-shell__kv-table-row--header,
.api-automation-shell__kv-table-header--header,
.api-automation-shell__kv-table-row--query,
.api-automation-shell__kv-table-header--query,
.api-automation-shell__kv-table-row--body,
.api-automation-shell__kv-table-header--body {
  grid-template-columns: 54px minmax(120px, 1fr) minmax(120px, 1fr) minmax(100px, 0.8fr) 58px;
}

.api-automation-shell__body-mode-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}

.api-automation-shell__body-mode {
  min-height: 28px;
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: #ffffff;
  color: var(--app-color-text-muted);
  cursor: pointer;
  font-size: 12px;
  padding: 0 10px;
}

.api-automation-shell__body-mode--active {
  border-color: rgb(var(--primary-6));
  background: rgba(var(--primary-6), 0.08);
  color: rgb(var(--primary-7));
  font-weight: 650;
}

.api-automation-shell__compact-empty {
  display: grid;
  min-height: 160px;
  place-items: center;
  border: 1px dashed var(--app-color-border);
  border-radius: var(--app-radius-sm);
  background: #fbfcfe;
  color: var(--app-color-text-muted);
  font-size: 13px;
}

.api-automation-shell__auth-editor {
  align-content: start;
}

.api-automation-shell__auth-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 220px));
  gap: 8px;
  min-width: 0;
}

.api-automation-shell__settings-editor :deep(.arco-form-item) {
  margin-bottom: 0;
}

.api-automation-shell__editor-surface :deep(.api-processor-editor__header) {
  display: none;
}

.api-automation-shell__cases-editor {
  min-height: 360px;
}

.api-automation-shell__cases-editor :deep(.api-case-management__header) {
  padding-bottom: 8px;
}

.api-automation-shell__cases-editor :deep(.api-case-management__list-head),
.api-automation-shell__cases-editor :deep(.api-case-management__row) {
  min-height: 34px;
}

.api-automation-shell__response-shell {
  background: #fbfcfe;
}

.api-automation-shell__response-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
  border-bottom: 1px solid var(--app-color-border);
  padding-bottom: 8px;
}

.api-automation-shell__response-header strong {
  color: var(--app-color-text);
  font-size: 14px;
}

.api-automation-shell__response-header span {
  color: var(--app-color-text-muted);
  font-size: 12px;
}

.api-automation-shell__panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--app-spacing-sm);
  min-width: 0;
}

.api-automation-shell__panel-header span {
  color: var(--app-color-text-muted);
  font-size: 12px;
}

.api-automation-shell__panel-title {
  margin: 0;
  color: var(--app-color-text);
  font-size: 15px;
  font-weight: 650;
  line-height: 1.4;
}

.api-automation-shell__panel-header p {
  margin: 2px 0 0;
  color: var(--app-color-text-muted);
  font-size: 12px;
}

@media (max-width: 1024px) {
  .api-automation-shell__toolbar,
  .api-automation-shell__definition-workbench {
    grid-template-columns: 1fr;
  }

  .api-automation-shell__rail {
    border-right: 0;
    border-bottom: 1px solid var(--app-color-border);
  }

  .api-automation-shell__request-shell,
  .api-automation-shell__command-row {
    grid-template-columns: 1fr;
  }

  .api-automation-shell__request-pane {
    border-right: 0;
    border-bottom: 1px solid var(--app-color-border);
  }
}

@media (max-width: 720px) {
  .api-automation-shell__context {
    grid-template-columns: 1fr;
  }

  .api-automation-shell__kv-header,
  .api-automation-shell__kv-row,
  .api-automation-shell__auth-fields {
    grid-template-columns: 1fr;
  }
}
</style>
