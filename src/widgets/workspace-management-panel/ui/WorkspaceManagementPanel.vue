<template>
  <section class="workspace-management">
    <header class="workspace-management__head">
      <div>
        <h2>{{ t.systemSettings.workspaceTitle }}</h2>
        <p>{{ t.systemSettings.workspaceDescription }}</p>
      </div>
      <button type="button" disabled>{{ t.systemSettings.workspaceCreate }}</button>
    </header>

    <section class="workspace-management__stats">
      <article>
        <span>{{ t.systemSettings.workspaceTotal }}</span>
        <strong>{{ workspaces.length }}</strong>
      </article>
      <article class="is-green">
        <span>{{ t.systemSettings.workspaceEnabled }}</span>
        <strong>{{ enabledCount }}</strong>
      </article>
      <article class="is-purple">
        <span>{{ t.systemSettings.workspaceAllScope }}</span>
        <strong>{{ allScopeCount }}</strong>
      </article>
      <article class="is-orange">
        <span>{{ t.systemSettings.workspaceProject }}</span>
        <strong>{{ projectCount }}</strong>
      </article>
    </section>

    <AppLoadingState v-if="loading" />
    <a-alert v-else-if="errorMessage" type="error" show-icon>
      <template #title>{{ errorMessage }}</template>
      <AppButton type="text" @click="loadWorkspaces">{{ t.common.retry }}</AppButton>
    </a-alert>
    <AppEmptyState v-else-if="!workspaces.length" :description="t.systemSettings.workspaceEmpty" />
    <section v-else class="workspace-management__grid">
      <article v-for="workspace in workspaces" :key="workspace.code" class="workspace-card">
        <header>
          <span>{{ workspace.name.slice(0, 1) }}</span>
          <div>
            <strong>{{ workspace.name }}</strong>
            <p>{{ workspace.description || t.systemSettings.workspaceNoDescription }}</p>
          </div>
          <small :class="{ 'is-disabled': workspace.status !== 1 }">
            {{ workspace.status === 1 ? t.configCenter.statusEnabled : t.configCenter.statusDisabled }}
          </small>
        </header>
        <div class="workspace-card__meta">
          <span>{{ t.systemSettings.workspaceCode }} {{ workspace.code }}</span>
          <span>{{ t.systemSettings.workspaceType }} {{ workspace.workspaceType || '-' }}</span>
          <span>{{ t.systemSettings.workspaceOwner }} {{ workspace.ownerName || '-' }}</span>
        </div>
        <footer>
          <button type="button">{{ t.systemSettings.workspaceMembers }}</button>
          <button type="button">{{ t.common.detail }}</button>
        </footer>
      </article>
    </section>

    <p class="workspace-management__contract">{{ t.systemSettings.workspaceContractHint }}</p>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { workspaceApi, type Workspace } from '@entities/workspace';
import { t } from '@shared/i18n';
import { AppButton, AppEmptyState, AppLoadingState } from '@shared/ui';

const loading = ref(false);
const errorMessage = ref('');
const workspaces = ref<Workspace[]>([]);

const enabledCount = computed(() => workspaces.value.filter((item) => item.status === 1).length);
const allScopeCount = computed(() => workspaces.value.filter((item) => item.allScope).length);
const projectCount = computed(
  () => workspaces.value.filter((item) => item.workspaceType === 'PROJECT').length
);

async function loadWorkspaces() {
  loading.value = true;
  errorMessage.value = '';

  try {
    workspaces.value = await workspaceApi.list();
  } catch {
    workspaces.value = [];
    errorMessage.value = t.systemSettings.workspaceLoadFailed;
  } finally {
    loading.value = false;
  }
}

onMounted(loadWorkspaces);
</script>

<style scoped>
.workspace-management {
  min-width: 0;
}

.workspace-management__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.workspace-management__head h2 {
  margin: 0;
  color: #111827;
  font-size: 16px;
  font-weight: 700;
}

.workspace-management__head p {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 13px;
}

.workspace-management__head button {
  height: 38px;
  border: 0;
  border-radius: 12px;
  background: #d1d5db;
  color: #ffffff;
  cursor: not-allowed;
  font-size: 13px;
  font-weight: 650;
  padding: 0 16px;
}

.workspace-management__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.workspace-management__stats article,
.workspace-card {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
}

.workspace-management__stats article {
  padding: 18px 20px;
}

.workspace-management__stats span {
  color: #6b7280;
  font-size: 12px;
}

.workspace-management__stats strong {
  display: block;
  margin-top: 8px;
  color: #2563eb;
  font-size: 26px;
  line-height: 30px;
}

.workspace-management__stats .is-green strong {
  color: #16a34a;
}

.workspace-management__stats .is-purple strong {
  color: #7c3aed;
}

.workspace-management__stats .is-orange strong {
  color: #ea580c;
}

.workspace-management__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.workspace-card {
  padding: 20px;
  transition:
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.workspace-card:hover {
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
  transform: translateY(-1px);
}

.workspace-card header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.workspace-card header > span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #ffffff;
  font-size: 16px;
  font-weight: 800;
}

.workspace-card header div {
  flex: 1;
  min-width: 0;
}

.workspace-card header strong {
  display: block;
  overflow: hidden;
  color: #111827;
  font-size: 14px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workspace-card header p {
  display: -webkit-box;
  overflow: hidden;
  margin: 4px 0 0;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #6b7280;
  font-size: 12px;
  line-height: 18px;
}

.workspace-card header small {
  flex-shrink: 0;
  border-radius: 999px;
  background: #dcfce7;
  color: #15803d;
  font-size: 12px;
  font-weight: 650;
  padding: 3px 9px;
}

.workspace-card header small.is-disabled {
  background: #f3f4f6;
  color: #6b7280;
}

.workspace-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.workspace-card__meta span {
  border-radius: 8px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 12px;
  padding: 5px 8px;
}

.workspace-card footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

.workspace-card footer button {
  height: 30px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  cursor: pointer;
  font-size: 12px;
  font-weight: 650;
  padding: 0 10px;
}

.workspace-management__contract {
  margin: 18px 0 0;
  color: #9ca3af;
  font-size: 12px;
}

@media (max-width: 1100px) {
  .workspace-management__stats,
  .workspace-management__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .workspace-management__head {
    flex-direction: column;
  }

  .workspace-management__stats,
  .workspace-management__grid {
    grid-template-columns: 1fr;
  }
}
</style>
