<template>
  <AppSection :title="t.configCenter.title" :description="t.configCenter.description">
    <template #actions>
      <AppButton type="text" :loading="loading" @click="loadOverview">
        {{ t.common.retry }}
      </AppButton>
    </template>

    <a-grid :cols="{ xs: 1, sm: 4 }" :col-gap="12" :row-gap="12">
      <a-grid-item>
        <a-statistic :title="t.configCenter.envTotal" :value="summary.envTotal" />
      </a-grid-item>
      <a-grid-item>
        <a-statistic :title="t.configCenter.paramTotal" :value="summary.paramTotal" />
      </a-grid-item>
      <a-grid-item>
        <a-statistic :title="t.configCenter.dbTotal" :value="summary.dbTotal" />
      </a-grid-item>
      <a-grid-item>
        <a-statistic :title="t.configCenter.enabledTotal" :value="summary.enabledTotal" />
      </a-grid-item>
    </a-grid>

    <AppLoadingState v-if="loading" />
    <a-alert v-else-if="errorMessage" type="error" show-icon>
      <template #title>{{ errorMessage }}</template>
      <AppButton type="text" @click="loadOverview">{{ t.common.retry }}</AppButton>
    </a-alert>
    <div v-else class="config-center-overview__grid">
      <ConfigListPanel
        :title="t.configCenter.envSection"
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
        :title="t.configCenter.paramSection"
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
        :title="t.configCenter.dbSection"
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
    </div>
  </AppSection>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
import { AppButton, AppLoadingState, AppSection } from '@shared/ui';
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
</script>

<style scoped>
.config-center-overview__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--app-spacing-md);
  min-width: 0;
}

@media (max-width: 1024px) {
  .config-center-overview__grid {
    grid-template-columns: 1fr;
  }
}
</style>
