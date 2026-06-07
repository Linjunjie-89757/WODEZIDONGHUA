<template>
  <section class="config-center-overview">
    <aside class="config-center-overview__nav">
      <p>{{ t.configCenter.categoryTitle }}</p>
      <button
        v-for="item in navItems"
        :key="item.key"
        type="button"
        :class="{ 'is-active': activeKey === item.key }"
        @click="activeKey = item.key"
      >
        <span>{{ item.icon }}</span>
        <strong>{{ item.label }}</strong>
        <small>{{ item.description }}</small>
      </button>
    </aside>

    <main class="config-center-overview__content">
      <header class="config-center-overview__head">
        <div>
          <h2>{{ t.configCenter.title }}</h2>
          <p>{{ t.configCenter.description }}</p>
        </div>
        <AppButton type="text" :loading="loading" @click="loadOverview">
          {{ t.common.retry }}
        </AppButton>
      </header>

      <section class="config-center-overview__stats">
        <article>
          <span>{{ t.configCenter.envTotal }}</span>
          <strong>{{ summary.envTotal }}</strong>
        </article>
        <article class="is-purple">
          <span>{{ t.configCenter.paramTotal }}</span>
          <strong>{{ summary.paramTotal }}</strong>
        </article>
        <article class="is-orange">
          <span>{{ t.configCenter.dbTotal }}</span>
          <strong>{{ summary.dbTotal }}</strong>
        </article>
        <article class="is-green">
          <span>{{ t.configCenter.enabledTotal }}</span>
          <strong>{{ summary.enabledTotal }}</strong>
        </article>
      </section>

      <AppLoadingState v-if="loading" />
      <a-alert v-else-if="errorMessage" type="error" show-icon>
        <template #title>{{ errorMessage }}</template>
        <AppButton type="text" @click="loadOverview">{{ t.common.retry }}</AppButton>
      </a-alert>
      <ConfigListPanel
        v-else-if="activeKey === 'env'"
        :title="t.configCenter.envSection"
        :description="t.configCenter.envDescription"
        :empty-text="t.configCenter.envEmpty"
        :count="envs.length"
      >
        <template #actions>
          <ConfigEnvCreateDialog @success="loadOverview" />
        </template>
        <ConfigListItem
          v-for="env in envs"
          :key="env.id"
          :title="env.envName"
          :subtitle="env.baseUrl"
          :meta="env.envType"
          :status="env.status"
        >
          <template #actions>
            <ConfigEnvToggleButton :env="env" @success="loadOverview" />
            <ConfigEnvEditDialog :env="env" @success="loadOverview" />
            <ConfigEnvDeleteButton
              :env-id="env.id"
              :workspace-code="env.workspaceCode"
              @success="loadOverview"
            />
          </template>
        </ConfigListItem>
      </ConfigListPanel>

      <ConfigListPanel
        v-else-if="activeKey === 'params'"
        :title="t.configCenter.paramSection"
        :description="t.configCenter.paramDescription"
        :empty-text="t.configCenter.paramEmpty"
        :count="params.length"
      >
        <template #actions>
          <ConfigParamCreateDialog @success="loadOverview" />
        </template>
        <ConfigListItem
          v-for="param in params"
          :key="param.id"
          :title="param.paramName"
          :subtitle="param.paramType"
          :meta="param.workspaceName || param.workspaceCode"
          :status="param.status"
        >
          <template #actions>
            <ConfigParamToggleButton :param="param" @success="loadOverview" />
            <ConfigParamEditDialog :param="param" @success="loadOverview" />
            <ConfigParamDeleteButton
              :param-id="param.id"
              :workspace-code="param.workspaceCode"
              @success="loadOverview"
            />
          </template>
        </ConfigListItem>
      </ConfigListPanel>

      <ConfigListPanel
        v-else
        :title="t.configCenter.dbSection"
        :description="t.configCenter.dbDescription"
        :empty-text="t.configCenter.dbEmpty"
        :count="dbConnections.length"
      >
        <template #actions>
          <ConfigDbCreateDialog @success="loadOverview" />
        </template>
        <ConfigListItem
          v-for="db in dbConnections"
          :key="db.id"
          :title="db.connectionName"
          :subtitle="db.jdbcUrl"
          :meta="db.dbType"
          :status="db.status"
        >
          <template #actions>
            <ConfigDbTestButton :db="db" />
            <ConfigDbToggleButton :db="db" @success="loadOverview" />
            <ConfigDbEditDialog :db="db" @success="loadOverview" />
            <ConfigDbDeleteButton
              :db-id="db.id"
              :workspace-code="db.workspaceCode"
              @success="loadOverview"
            />
          </template>
        </ConfigListItem>
      </ConfigListPanel>
    </main>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { t } from '@shared/i18n';
import { AppButton, AppLoadingState } from '@shared/ui';
import { ConfigDbCreateDialog } from '@features/config-db-create';
import { ConfigDbDeleteButton } from '@features/config-db-delete';
import { ConfigDbEditDialog } from '@features/config-db-edit';
import { ConfigDbTestButton } from '@features/config-db-test';
import { ConfigDbToggleButton } from '@features/config-db-toggle';
import { ConfigEnvCreateDialog } from '@features/config-env-create';
import { ConfigEnvDeleteButton } from '@features/config-env-delete';
import { ConfigEnvEditDialog } from '@features/config-env-edit';
import { ConfigEnvToggleButton } from '@features/config-env-toggle';
import { ConfigParamCreateDialog } from '@features/config-param-create';
import { ConfigParamDeleteButton } from '@features/config-param-delete';
import { ConfigParamEditDialog } from '@features/config-param-edit';
import { ConfigParamToggleButton } from '@features/config-param-toggle';

import { useConfigCenterOverview } from '../model/useConfigCenterOverview';
import ConfigListItem from './ConfigListItem.vue';
import ConfigListPanel from './ConfigListPanel.vue';

const { loading, errorMessage, envs, params, dbConnections, summary, loadOverview } =
  useConfigCenterOverview();

const activeKey = ref<'env' | 'params' | 'database'>('env');

const navItems = [
  {
    key: 'env',
    label: t.configCenter.envSection,
    description: t.configCenter.envNavDescription,
    icon: '环'
  },
  {
    key: 'params',
    label: t.configCenter.paramSection,
    description: t.configCenter.paramNavDescription,
    icon: '参'
  },
  {
    key: 'database',
    label: t.configCenter.dbSection,
    description: t.configCenter.dbNavDescription,
    icon: '库'
  }
] as const;
</script>

<style scoped>
.config-center-overview {
  display: flex;
  width: 100%;
  min-width: 0;
  min-height: calc(100vh - 56px);
  overflow: hidden;
}

.config-center-overview__nav {
  width: 224px;
  min-width: 224px;
  border-right: 1px solid #e5e7eb;
  background: #ffffff;
  padding: 16px 12px;
}

.config-center-overview__nav p {
  margin: 0 0 10px;
  color: #9ca3af;
  font-size: 12px;
  font-weight: 700;
  padding: 0 12px;
}

.config-center-overview__nav button {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  width: 100%;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #4b5563;
  cursor: pointer;
  column-gap: 12px;
  margin-bottom: 2px;
  padding: 10px 12px;
  text-align: left;
}

.config-center-overview__nav button:hover {
  background: #f9fafb;
}

.config-center-overview__nav button.is-active {
  background: #eff6ff;
  color: #1d4ed8;
}

.config-center-overview__nav button > span {
  display: flex;
  align-items: center;
  justify-content: center;
  grid-row: 1 / span 2;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 13px;
  font-weight: 800;
}

.config-center-overview__nav button.is-active > span {
  background: #dbeafe;
  color: #2563eb;
}

.config-center-overview__nav strong,
.config-center-overview__nav small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.config-center-overview__nav strong {
  font-size: 14px;
  font-weight: 650;
}

.config-center-overview__nav small {
  color: #9ca3af;
  font-size: 12px;
}

.config-center-overview__content {
  flex: 1;
  min-width: 0;
  overflow: auto;
  padding: 28px 32px;
}

.config-center-overview__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.config-center-overview__head h2 {
  margin: 0;
  color: #111827;
  font-size: 16px;
  font-weight: 700;
}

.config-center-overview__head p {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 13px;
}

.config-center-overview__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.config-center-overview__stats article {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
  padding: 18px 20px;
}

.config-center-overview__stats span {
  color: #6b7280;
  font-size: 12px;
}

.config-center-overview__stats strong {
  display: block;
  margin-top: 8px;
  color: #2563eb;
  font-size: 26px;
  line-height: 30px;
}

.config-center-overview__stats .is-purple strong {
  color: #7c3aed;
}

.config-center-overview__stats .is-orange strong {
  color: #ea580c;
}

.config-center-overview__stats .is-green strong {
  color: #16a34a;
}

@media (max-width: 1024px) {
  .config-center-overview__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 820px) {
  .config-center-overview {
    flex-direction: column;
  }

  .config-center-overview__nav {
    width: 100%;
    min-width: 0;
    border-right: 0;
    border-bottom: 1px solid #e5e7eb;
  }

  .config-center-overview__content {
    padding: 20px 16px;
  }

  .config-center-overview__stats {
    grid-template-columns: 1fr;
  }
}
</style>
