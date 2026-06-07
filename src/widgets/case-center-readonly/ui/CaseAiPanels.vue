<template>
  <section v-if="activeTab === 'ai-generate'" class="case-ai-panel case-ai-generate">
    <aside class="case-ai-generate__form">
      <div class="case-ai-panel__head">
        <span>{{ t.caseCenter.aiGenerateEyebrow }}</span>
        <strong>{{ t.caseCenter.aiGenerateTitle }}</strong>
        <p>{{ t.caseCenter.aiGenerateDescription }}</p>
      </div>

      <label class="case-ai-field">
        <span>{{ t.caseCenter.aiRequirementTitle }}</span>
        <input :placeholder="t.caseCenter.aiRequirementTitlePlaceholder" />
      </label>

      <label class="case-ai-field">
        <span>{{ t.caseCenter.aiRequirementContent }}</span>
        <textarea rows="8" :placeholder="t.caseCenter.aiRequirementContentPlaceholder"></textarea>
      </label>

      <div class="case-ai-generate__options">
        <label class="case-ai-field">
          <span>{{ t.caseCenter.aiOutputMode }}</span>
          <select>
            <option>{{ t.caseCenter.aiOutputStream }}</option>
            <option>{{ t.caseCenter.aiOutputComplete }}</option>
          </select>
        </label>
        <label class="case-ai-field">
          <span>{{ t.caseCenter.aiTargetDirectory }}</span>
          <select>
            <option>{{ t.caseCenter.aiDirectoryCurrent }}</option>
            <option>{{ t.caseCenter.allDirectories }}</option>
          </select>
        </label>
      </div>

      <div class="case-ai-generate__actions">
        <button type="button" class="case-ai-button case-ai-button--primary">
          {{ t.caseCenter.aiStartGenerate }}
        </button>
        <button type="button" class="case-ai-button">
          {{ t.caseCenter.aiImportRequirement }}
        </button>
      </div>

      <p class="case-ai-panel__contract-note">{{ t.caseCenter.aiContractReadonlyHint }}</p>
    </aside>

    <main class="case-ai-generate__preview">
      <section class="case-ai-process-card">
        <header>
          <strong>{{ t.caseCenter.aiGenerateProcess }}</strong>
          <span>{{ t.caseCenter.aiWaitingContract }}</span>
        </header>
        <div class="case-ai-process-card__steps">
          <div v-for="step in processSteps" :key="step" class="case-ai-process-card__step">
            <i></i>
            <span>{{ step }}</span>
          </div>
        </div>
      </section>

      <section class="case-ai-result-shell">
        <header>
          <div>
            <strong>{{ t.caseCenter.aiGeneratedCases }}</strong>
            <span>{{ t.caseCenter.aiGeneratedCasesHint }}</span>
          </div>
          <button type="button" class="case-ai-button case-ai-button--ghost">
            {{ t.caseCenter.aiAdoptSelected }}
          </button>
        </header>
        <div class="case-ai-result-shell__empty">
          <span></span>
          <strong>{{ t.caseCenter.aiNoGeneratedCases }}</strong>
          <p>{{ t.caseCenter.aiNoGeneratedCasesHint }}</p>
        </div>
      </section>
    </main>
  </section>

  <section v-else-if="activeTab === 'ai-history'" class="case-ai-panel case-ai-history">
    <div class="case-ai-history__stats">
      <button
        v-for="stat in historyStats"
        :key="stat.key"
        type="button"
        :class="['case-ai-history__stat', `is-${stat.tone}`]"
      >
        <span>{{ stat.label }}</span>
        <strong>{{ stat.value }}</strong>
      </button>
    </div>

    <section class="case-ai-history__table-shell">
      <header class="case-ai-history__toolbar">
        <select>
          <option>{{ t.caseCenter.aiAllStatus }}</option>
          <option>{{ t.caseCenter.aiStatusCompleted }}</option>
          <option>{{ t.caseCenter.aiStatusGenerating }}</option>
          <option>{{ t.caseCenter.aiStatusFailed }}</option>
        </select>
        <button type="button" class="case-ai-button">{{ t.caseCenter.aiRefresh }}</button>
        <span>{{ t.caseCenter.aiHistoryContractHint }}</span>
      </header>

      <div class="case-ai-history__table-wrap">
        <table>
          <thead>
            <tr>
              <th>{{ t.caseCenter.aiHistoryIndex }}</th>
              <th>{{ t.caseCenter.aiHistoryTaskId }}</th>
              <th>{{ t.caseCenter.aiHistoryWorkspace }}</th>
              <th>{{ t.caseCenter.aiHistoryRequirement }}</th>
              <th>{{ t.caseCenter.aiHistoryOutputMode }}</th>
              <th>{{ t.caseCenter.aiHistoryStatus }}</th>
              <th>{{ t.caseCenter.aiHistoryGeneratedCount }}</th>
              <th>{{ t.caseCenter.aiHistoryCreatedAt }}</th>
              <th>{{ t.common.actions }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in historyRows" :key="task.taskId">
              <td>{{ task.index }}</td>
              <td><span class="case-ai-history__task-id">{{ task.taskId }}</span></td>
              <td>{{ task.workspace }}</td>
              <td>{{ task.requirement }}</td>
              <td>{{ task.outputMode }}</td>
              <td>
                <span :class="['case-ai-history__status', `is-${task.tone}`]">
                  {{ task.status }}
                </span>
              </td>
              <td>{{ task.count }}</td>
              <td>{{ task.createdAt }}</td>
              <td>
                <button type="button">{{ t.common.detail }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>

  <section v-else-if="activeTab === 'ai-config'" class="case-ai-panel case-ai-config">
    <div class="case-ai-config__tip">
      <span></span>
      <p>
        {{ t.caseCenter.aiConfigTipPrefix }}
        <strong>{{ enabledModelCount }}</strong>
        {{ t.caseCenter.aiConfigTipSuffix }}
      </p>
    </div>

    <div class="case-ai-config__cards">
      <article
        v-for="role in aiRoles"
        :key="role.key"
        :class="['case-ai-role-card', { 'is-enabled': role.enabled }]"
      >
        <header>
          <div :class="['case-ai-role-card__icon', `is-${role.tone}`]">
            {{ role.icon }}
          </div>
          <div>
            <strong>{{ role.title }}</strong>
            <p>{{ role.description }}</p>
          </div>
          <label class="case-ai-switch">
            <span>{{ role.enabled ? t.caseCenter.aiEnabled : t.caseCenter.aiDisabled }}</span>
            <input v-model="role.enabled" type="checkbox" />
            <i></i>
          </label>
        </header>

        <div class="case-ai-role-card__body">
          <label class="case-ai-field">
            <span>{{ t.caseCenter.aiSelectModel }}</span>
            <small>{{ t.caseCenter.aiSelectModelHint }}</small>
            <select v-model="role.model">
              <option value="">{{ t.caseCenter.aiSelectModelPlaceholder }}</option>
              <option v-for="connection in aiConnections" :key="connection.id" :value="connection.model">
                {{ connection.model }} / {{ connection.name }}
              </option>
            </select>
          </label>

          <button
            type="button"
            class="case-ai-button"
            :disabled="!role.model || aiConnectionLoading"
            @click="testRoleConnection(role.title)"
          >
            {{ aiConnectionLoading ? t.common.loading : t.caseCenter.aiTestConnection }}
          </button>

          <label class="case-ai-slider">
            <span>{{ t.caseCenter.aiTemperature }}</span>
            <strong>{{ role.temperature }}</strong>
            <input v-model.number="role.temperature" type="range" min="0" max="1" step="0.1" />
          </label>

          <label class="case-ai-slider">
            <span>{{ t.caseCenter.aiTopP }}</span>
            <strong>{{ role.topP }}</strong>
            <input v-model.number="role.topP" type="range" min="0.1" max="1" step="0.05" />
          </label>

          <label class="case-ai-field">
            <span>{{ t.caseCenter.aiPromptTemplate }}</span>
            <textarea v-model="role.prompt" rows="7"></textarea>
          </label>

          <button type="button" class="case-ai-button case-ai-button--primary" @click="saveRoleConfig(role.title)">
            {{ t.caseCenter.aiSaveConfig }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';

import { aiModelApi, type AiConnection } from '@entities/ai-model';
import { useWorkspaceStore } from '@entities/workspace';
import { feedback } from '@shared/lib/feedback';
import { t } from '@shared/i18n';

type AiTab = 'ai-generate' | 'ai-history' | 'ai-config';

defineProps<{
  activeTab: AiTab;
}>();

const workspaceStore = useWorkspaceStore();
const aiConnections = ref<AiConnection[]>([]);
const aiConnectionLoading = ref(false);

const processSteps = [
  t.caseCenter.aiProcessAnalyze,
  t.caseCenter.aiProcessGenerate,
  t.caseCenter.aiProcessReview,
  t.caseCenter.aiProcessSave
];

const historyRows = [
  {
    index: 1,
    taskId: 'TASK-CONTRACT',
    workspace: workspaceStore.currentWorkspace.name || t.workspace.unselected,
    requirement: t.caseCenter.aiHistorySampleRequirement,
    outputMode: t.caseCenter.aiOutputStream,
    status: t.caseCenter.aiStatusWaitingContract,
    tone: 'warning',
    count: 0,
    createdAt: '-'
  }
];

const historyStats = computed(() => [
  { key: 'total', label: t.caseCenter.aiTaskTotal, value: historyRows.length, tone: 'blue' },
  { key: 'done', label: t.caseCenter.aiStatusCompleted, value: 0, tone: 'green' },
  { key: 'running', label: t.caseCenter.aiStatusGenerating, value: 0, tone: 'orange' },
  { key: 'failed', label: t.caseCenter.aiStatusFailed, value: 0, tone: 'red' }
]);

const aiRoles = reactive([
  {
    key: 'generator',
    title: t.caseCenter.aiGeneratorRole,
    description: t.caseCenter.aiGeneratorRoleDescription,
    icon: 'AI',
    tone: 'blue',
    enabled: true,
    model: '',
    temperature: 0.5,
    topP: 0.9,
    prompt: t.caseCenter.aiGeneratorPrompt
  },
  {
    key: 'reviewer',
    title: t.caseCenter.aiReviewerRole,
    description: t.caseCenter.aiReviewerRoleDescription,
    icon: 'QA',
    tone: 'green',
    enabled: true,
    model: '',
    temperature: 0.3,
    topP: 0.7,
    prompt: t.caseCenter.aiReviewerPrompt
  }
]);

const enabledModelCount = computed(
  () => aiConnections.value.filter((connection) => connection.enabled).length
);

async function loadAiConnections() {
  aiConnectionLoading.value = true;

  try {
    aiConnections.value = await aiModelApi.listConnections(workspaceStore.currentWorkspace.code);
    const firstModel = aiConnections.value.find((connection) => connection.enabled)?.model || '';
    aiRoles.forEach((role) => {
      if (!role.model) {
        role.model = firstModel;
      }
    });
  } catch {
    aiConnections.value = [];
    feedback.warning(t.caseCenter.aiConfigConnectionLoadFailed);
  } finally {
    aiConnectionLoading.value = false;
  }
}

function testRoleConnection(roleTitle: string) {
  feedback.success(t.caseCenter.aiConfigLocalTestHint.replace('{role}', roleTitle));
}

function saveRoleConfig(roleTitle: string) {
  feedback.success(t.caseCenter.aiConfigLocalSaveHint.replace('{role}', roleTitle));
}

onMounted(loadAiConnections);
</script>

<style scoped>
.case-ai-panel {
  grid-column: 1 / -1;
  min-width: 0;
  min-height: calc(100vh - 104px);
  overflow: auto;
  background: #f5f6f8;
}

.case-ai-generate {
  display: grid;
  grid-template-columns: minmax(360px, 430px) minmax(0, 1fr);
  gap: 20px;
  padding: 24px;
}

.case-ai-generate__form,
.case-ai-process-card,
.case-ai-result-shell,
.case-ai-history__table-shell,
.case-ai-config__tip,
.case-ai-role-card,
.case-ai-history__stat {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.case-ai-generate__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 22px;
}

.case-ai-panel__head span {
  display: inline-flex;
  align-items: center;
  height: 22px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  padding: 0 9px;
}

.case-ai-panel__head strong {
  display: block;
  margin-top: 12px;
  color: #111827;
  font-size: 18px;
  font-weight: 700;
}

.case-ai-panel__head p,
.case-ai-panel__contract-note,
.case-ai-result-shell header span,
.case-ai-role-card header p,
.case-ai-field small {
  color: #6b7280;
  font-size: 12px;
  line-height: 18px;
}

.case-ai-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.case-ai-field span,
.case-ai-slider span {
  color: #374151;
  font-size: 13px;
  font-weight: 600;
}

.case-ai-field input,
.case-ai-field textarea,
.case-ai-field select,
.case-ai-history__toolbar select {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #ffffff;
  color: #111827;
  font-size: 13px;
  outline: none;
}

.case-ai-field input,
.case-ai-field select,
.case-ai-history__toolbar select {
  height: 36px;
  padding: 0 11px;
}

.case-ai-field textarea {
  resize: vertical;
  padding: 10px 11px;
}

.case-ai-generate__options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.case-ai-generate__actions,
.case-ai-history__toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.case-ai-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 34px;
  border: 1px solid #d1d5db;
  border-radius: 9px;
  background: #ffffff;
  color: #374151;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  padding: 0 14px;
}

.case-ai-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.case-ai-button--primary {
  border-color: #2563eb;
  background: #2563eb;
  color: #ffffff;
}

.case-ai-button--ghost {
  border-color: #dbeafe;
  color: #2563eb;
}

.case-ai-generate__preview {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 20px;
  min-width: 0;
}

.case-ai-process-card {
  padding: 20px;
}

.case-ai-process-card header,
.case-ai-result-shell header,
.case-ai-role-card header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.case-ai-process-card header strong,
.case-ai-result-shell header strong,
.case-ai-role-card header strong {
  color: #111827;
  font-size: 15px;
  font-weight: 700;
}

.case-ai-process-card header span {
  color: #9ca3af;
  font-size: 12px;
}

.case-ai-process-card__steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.case-ai-process-card__step {
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
  color: #374151;
  font-size: 13px;
  font-weight: 600;
  padding: 12px;
}

.case-ai-process-card__step i {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: #2563eb;
}

.case-ai-result-shell {
  min-width: 0;
  overflow: hidden;
}

.case-ai-result-shell header {
  border-bottom: 1px solid #e5e7eb;
  padding: 18px 20px;
}

.case-ai-result-shell__empty {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  min-height: 360px;
  padding: 40px;
  text-align: center;
}

.case-ai-result-shell__empty span {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background:
    linear-gradient(135deg, #eff6ff, #f5f3ff);
}

.case-ai-result-shell__empty strong {
  margin-top: 14px;
  color: #111827;
  font-size: 15px;
}

.case-ai-result-shell__empty p {
  max-width: 360px;
  margin: 8px 0 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 20px;
}

.case-ai-history,
.case-ai-config {
  padding: 24px;
}

.case-ai-history__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.case-ai-history__stat {
  cursor: pointer;
  padding: 17px 20px;
  text-align: left;
}

.case-ai-history__stat span {
  color: #6b7280;
  font-size: 12px;
}

.case-ai-history__stat strong {
  display: block;
  margin-top: 8px;
  font-size: 28px;
  line-height: 32px;
}

.case-ai-history__stat.is-blue strong {
  color: #2563eb;
}

.case-ai-history__stat.is-green strong {
  color: #16a34a;
}

.case-ai-history__stat.is-orange strong {
  color: #ea580c;
}

.case-ai-history__stat.is-red strong {
  color: #dc2626;
}

.case-ai-history__toolbar {
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 20px;
}

.case-ai-history__toolbar select {
  width: 140px;
}

.case-ai-history__toolbar span {
  margin-left: auto;
  color: #9ca3af;
  font-size: 12px;
}

.case-ai-history__table-wrap {
  overflow-x: auto;
}

.case-ai-history table {
  width: 100%;
  min-width: 1040px;
  border-collapse: collapse;
}

.case-ai-history th,
.case-ai-history td {
  border-bottom: 1px solid #e5e7eb;
  font-size: 13px;
  padding: 12px 20px;
  text-align: left;
  white-space: nowrap;
}

.case-ai-history th {
  height: 40px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
}

.case-ai-history td {
  color: #374151;
}

.case-ai-history td button {
  border: 0;
  background: transparent;
  color: #2563eb;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}

.case-ai-history__task-id {
  display: inline-flex;
  border-radius: 7px;
  background: #eff6ff;
  color: #2563eb;
  font-family: Consolas, "Courier New", monospace;
  font-size: 12px;
  padding: 2px 8px;
}

.case-ai-history__status {
  display: inline-flex;
  align-items: center;
  height: 22px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  padding: 0 9px;
}

.case-ai-history__status.is-warning {
  border-color: #fde68a;
  background: #fffbeb;
  color: #d97706;
}

.case-ai-config__tip {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  border-color: #bfdbfe;
  background: #eff6ff;
  padding: 14px 16px;
}

.case-ai-config__tip span {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #2563eb;
}

.case-ai-config__tip p {
  margin: 0;
  color: #1d4ed8;
  font-size: 13px;
}

.case-ai-config__cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.case-ai-role-card {
  overflow: hidden;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.case-ai-role-card.is-enabled {
  border-color: #bfdbfe;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.08);
}

.case-ai-role-card header {
  border-bottom: 1px solid #f3f4f6;
  padding: 20px 22px 16px;
}

.case-ai-role-card header > div:nth-child(2) {
  flex: 1;
  min-width: 0;
}

.case-ai-role-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 800;
}

.case-ai-role-card__icon.is-blue {
  background: #eff6ff;
  color: #2563eb;
}

.case-ai-role-card__icon.is-green {
  background: #f0fdf4;
  color: #16a34a;
}

.case-ai-role-card__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 22px 22px;
}

.case-ai-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 12px;
}

.case-ai-switch input {
  position: absolute;
  opacity: 0;
}

.case-ai-switch i {
  position: relative;
  width: 40px;
  height: 22px;
  border-radius: 999px;
  background: #d1d5db;
  cursor: pointer;
  transition: background 0.18s ease;
}

.case-ai-switch i::after {
  content: "";
  position: absolute;
  left: 3px;
  top: 3px;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.24);
  transition: transform 0.18s ease;
}

.case-ai-switch input:checked + i {
  background: #2563eb;
}

.case-ai-switch input:checked + i::after {
  transform: translateX(18px);
}

.case-ai-slider {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.case-ai-slider strong {
  color: #2563eb;
  font-size: 12px;
}

.case-ai-slider input {
  grid-column: 1 / -1;
  accent-color: #2563eb;
}

@media (max-width: 1080px) {
  .case-ai-generate,
  .case-ai-config__cards {
    grid-template-columns: 1fr;
  }

  .case-ai-history__stats,
  .case-ai-process-card__steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .case-ai-generate,
  .case-ai-history,
  .case-ai-config {
    padding: 16px;
  }

  .case-ai-generate__options,
  .case-ai-history__stats,
  .case-ai-process-card__steps {
    grid-template-columns: 1fr;
  }

  .case-ai-history__toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .case-ai-history__toolbar span {
    margin-left: 0;
  }
}
</style>
