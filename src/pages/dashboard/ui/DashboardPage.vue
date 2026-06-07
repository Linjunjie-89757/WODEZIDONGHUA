<template>
  <section class="dashboard-page">
    <div class="dashboard-page__stats">
      <article
        v-for="stat in stats"
        :key="stat.label"
        :class="['dashboard-stat', `dashboard-stat--${stat.tone}`]"
      >
        <div class="dashboard-stat__header">
          <span>{{ stat.label }}</span>
          <i></i>
        </div>
        <strong>{{ stat.value }}</strong>
        <p>{{ stat.hint }}</p>
      </article>
    </div>

    <div class="dashboard-page__grid">
      <section class="dashboard-panel dashboard-panel--wide">
        <header class="dashboard-panel__header">
          <div>
            <h2>{{ t.dashboard.moduleTitle }}</h2>
            <p>{{ t.dashboard.moduleDescription }}</p>
          </div>
        </header>

        <div class="dashboard-modules">
          <RouterLink
            v-for="module in modules"
            :key="module.path"
            :to="module.path"
            :class="['dashboard-module', `dashboard-module--${module.tone}`]"
          >
            <span class="dashboard-module__icon" :data-icon="module.icon"></span>
            <div>
              <strong>{{ module.title }}</strong>
              <p>{{ module.description }}</p>
            </div>
            <i></i>
          </RouterLink>
        </div>
      </section>

      <section class="dashboard-panel">
        <header class="dashboard-panel__header">
          <div>
            <h2>{{ t.dashboard.quickTitle }}</h2>
            <p>{{ t.dashboard.quickDescription }}</p>
          </div>
        </header>

        <div class="dashboard-actions">
          <RouterLink v-for="action in quickActions" :key="action.path" :to="action.path">
            <span>{{ action.label }}</span>
            <i></i>
          </RouterLink>
        </div>
      </section>
    </div>

    <div class="dashboard-page__grid dashboard-page__grid--bottom">
      <section class="dashboard-panel dashboard-panel--wide">
        <header class="dashboard-panel__header">
          <div>
            <h2>{{ t.dashboard.recentTitle }}</h2>
            <p>{{ t.dashboard.recentDescription }}</p>
          </div>
        </header>

        <div class="dashboard-table-wrap">
          <table class="dashboard-table">
            <thead>
              <tr>
                <th>{{ t.dashboard.tableModule }}</th>
                <th>{{ t.dashboard.tableItem }}</th>
                <th>{{ t.dashboard.tableStatus }}</th>
                <th>{{ t.dashboard.tableOwner }}</th>
                <th>{{ t.dashboard.tableUpdatedAt }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in recentItems" :key="item.id">
                <td>
                  <span class="dashboard-table__module">{{ item.module }}</span>
                </td>
                <td>
                  <strong>{{ item.title }}</strong>
                  <small>{{ item.desc }}</small>
                </td>
                <td>
                  <span :class="['dashboard-status', `dashboard-status--${item.statusTone}`]">
                    {{ item.status }}
                  </span>
                </td>
                <td>{{ item.owner }}</td>
                <td>{{ item.updatedAt }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="dashboard-panel">
        <header class="dashboard-panel__header">
          <div>
            <h2>{{ t.dashboard.migrationTitle }}</h2>
            <p>{{ t.dashboard.migrationDescription }}</p>
          </div>
        </header>

        <ol class="dashboard-timeline">
          <li v-for="item in migrationItems" :key="item.label" :class="{ 'is-active': item.active }">
            <span></span>
            <div>
              <strong>{{ item.label }}</strong>
              <p>{{ item.hint }}</p>
            </div>
          </li>
        </ol>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

import { t } from '@shared/i18n';

const stats = [
  {
    label: t.dashboard.statsCaseTotal,
    value: '128',
    hint: t.dashboard.statsCaseHint,
    tone: 'blue'
  },
  {
    label: t.dashboard.statsBugTodo,
    value: '12',
    hint: t.dashboard.statsBugHint,
    tone: 'purple'
  },
  {
    label: t.dashboard.statsApiTotal,
    value: '46',
    hint: t.dashboard.statsApiHint,
    tone: 'green'
  },
  {
    label: t.dashboard.statsAiReady,
    value: '6',
    hint: t.dashboard.statsAiHint,
    tone: 'orange'
  }
] as const;

const modules = [
  {
    title: t.navigation.caseCenter,
    description: t.dashboard.caseModuleDescription,
    path: '/case-center',
    icon: 'case',
    tone: 'blue'
  },
  {
    title: t.navigation.apiAutomation,
    description: t.dashboard.apiModuleDescription,
    path: '/api-automation',
    icon: 'api',
    tone: 'green'
  },
  {
    title: t.navigation.configCenter,
    description: t.dashboard.configModuleDescription,
    path: '/config-center',
    icon: 'config',
    tone: 'orange'
  },
  {
    title: t.navigation.systemSettings,
    description: t.dashboard.settingsModuleDescription,
    path: '/system-settings/ai-connections',
    icon: 'settings',
    tone: 'purple'
  }
] as const;

const quickActions = [
  { label: t.dashboard.quickCase, path: '/case-center' },
  { label: t.dashboard.quickApi, path: '/api-automation' },
  { label: t.dashboard.quickConfig, path: '/config-center' },
  { label: t.dashboard.quickAi, path: '/system-settings/ai-connections' }
] as const;

const recentItems = [
  {
    id: 'CASE-00131',
    module: t.navigation.caseCenter,
    title: t.dashboard.recentCaseTitle,
    desc: 'CASE-00131',
    status: t.dashboard.statusReady,
    statusTone: 'success',
    owner: t.common.superAdmin,
    updatedAt: '2026-06-08 09:30'
  },
  {
    id: 'API-00046',
    module: t.navigation.apiAutomation,
    title: t.dashboard.recentApiTitle,
    desc: 'POST /api/debug',
    status: t.dashboard.statusRunning,
    statusTone: 'processing',
    owner: t.common.superAdmin,
    updatedAt: '2026-06-08 09:12'
  },
  {
    id: 'CFG-ENV',
    module: t.navigation.configCenter,
    title: t.dashboard.recentConfigTitle,
    desc: t.dashboard.recentConfigDesc,
    status: t.dashboard.statusEnabled,
    statusTone: 'success',
    owner: t.common.superAdmin,
    updatedAt: '2026-06-07 22:18'
  }
] as const;

const migrationItems = [
  {
    label: t.dashboard.migrationShell,
    hint: t.dashboard.migrationShellHint,
    active: true
  },
  {
    label: t.dashboard.migrationCase,
    hint: t.dashboard.migrationCaseHint,
    active: true
  },
  {
    label: t.dashboard.migrationSettings,
    hint: t.dashboard.migrationSettingsHint,
    active: false
  },
  {
    label: t.dashboard.migrationConfig,
    hint: t.dashboard.migrationConfigHint,
    active: false
  }
] as const;
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
  padding: 32px;
}

.dashboard-page__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  min-width: 0;
}

.dashboard-stat,
.dashboard-panel {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.dashboard-stat {
  min-width: 0;
  padding: 24px;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.dashboard-stat:hover {
  border-color: #d7dce5;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  transform: translateY(-1px);
}

.dashboard-stat__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.dashboard-stat__header span {
  color: #4b5563;
  font-size: 14px;
  line-height: 20px;
}

.dashboard-stat__header i {
  display: block;
  width: 8px;
  height: 8px;
  margin-top: 4px;
  border-radius: 999px;
  background: currentColor;
}

.dashboard-stat strong {
  display: block;
  color: #111827;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.15;
}

.dashboard-stat p,
.dashboard-panel__header p,
.dashboard-module p,
.dashboard-timeline p {
  margin: 0;
  color: #6b7280;
}

.dashboard-stat p {
  margin-top: 8px;
  font-size: 12px;
  line-height: 18px;
}

.dashboard-stat--blue {
  color: #3b82f6;
}

.dashboard-stat--purple {
  color: #8b5cf6;
}

.dashboard-stat--green {
  color: #22c55e;
}

.dashboard-stat--orange {
  color: #f97316;
}

.dashboard-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 24px;
  min-width: 0;
}

.dashboard-page__grid--bottom {
  align-items: stretch;
}

.dashboard-panel {
  min-width: 0;
  overflow: hidden;
}

.dashboard-panel--wide {
  min-width: 0;
}

.dashboard-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.dashboard-panel__header h2 {
  margin: 0;
  color: #111827;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

.dashboard-panel__header p {
  margin-top: 2px;
  font-size: 13px;
  line-height: 20px;
}

.dashboard-modules {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 20px 24px 24px;
}

.dashboard-module {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
  min-height: 92px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  padding: 16px;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.dashboard-module:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
}

.dashboard-module__icon {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: currentColor;
  opacity: 0.12;
}

.dashboard-module__icon::after {
  content: "";
  position: absolute;
  inset: 9px;
  border: 2px solid currentColor;
  border-radius: 4px;
  opacity: 1;
}

.dashboard-module--blue {
  color: #2563eb;
}

.dashboard-module--green {
  color: #16a34a;
}

.dashboard-module--orange {
  color: #ea580c;
}

.dashboard-module--purple {
  color: #7c3aed;
}

.dashboard-module strong {
  display: block;
  color: #111827;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.dashboard-module p {
  margin-top: 4px;
  font-size: 12px;
  line-height: 18px;
}

.dashboard-module i,
.dashboard-actions i {
  position: absolute;
  right: 16px;
  top: 18px;
  width: 7px;
  height: 7px;
  border-right: 1.5px solid #9ca3af;
  border-bottom: 1.5px solid #9ca3af;
  transform: rotate(-45deg);
}

.dashboard-actions {
  display: grid;
  gap: 10px;
  padding: 20px 24px 24px;
}

.dashboard-actions a {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 42px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #1f2937;
  font-size: 13px;
  font-weight: 500;
  padding: 0 36px 0 14px;
  transition:
    background 0.18s ease,
    border-color 0.18s ease;
}

.dashboard-actions a:hover {
  border-color: #bfdbfe;
  background: #eff6ff;
  color: #2563eb;
}

.dashboard-table-wrap {
  min-width: 0;
  overflow-x: auto;
}

.dashboard-table {
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
}

.dashboard-table th {
  height: 40px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
  text-align: left;
  padding: 0 16px;
}

.dashboard-table td {
  height: 52px;
  border-top: 1px solid #eef2f7;
  color: #4b5563;
  font-size: 13px;
  padding: 8px 16px;
  vertical-align: middle;
}

.dashboard-table tbody tr:hover {
  background: #f9fafb;
}

.dashboard-table td strong {
  display: block;
  max-width: 320px;
  overflow: hidden;
  color: #111827;
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dashboard-table td small {
  display: block;
  margin-top: 2px;
  color: #9ca3af;
  font-size: 12px;
  line-height: 16px;
}

.dashboard-table__module {
  color: #2563eb;
  font-weight: 600;
}

.dashboard-status {
  display: inline-flex;
  align-items: center;
  height: 22px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  padding: 0 9px;
  white-space: nowrap;
}

.dashboard-status--success {
  border-color: #bbf7d0;
  background: #f0fdf4;
  color: #15803d;
}

.dashboard-status--processing {
  border-color: #bfdbfe;
  background: #eff6ff;
  color: #2563eb;
}

.dashboard-timeline {
  display: grid;
  gap: 0;
  margin: 0;
  list-style: none;
  padding: 8px 24px 24px;
}

.dashboard-timeline li {
  position: relative;
  display: flex;
  gap: 12px;
  min-height: 66px;
  padding-top: 14px;
}

.dashboard-timeline li::before {
  content: "";
  position: absolute;
  left: 5px;
  top: 34px;
  bottom: -12px;
  width: 1px;
  background: #e5e7eb;
}

.dashboard-timeline li:last-child::before {
  display: none;
}

.dashboard-timeline span {
  position: relative;
  z-index: 1;
  flex: 0 0 auto;
  width: 11px;
  height: 11px;
  margin-top: 5px;
  border: 2px solid #cbd5e1;
  border-radius: 999px;
  background: #ffffff;
}

.dashboard-timeline li.is-active span {
  border-color: #2563eb;
  background: #2563eb;
}

.dashboard-timeline strong {
  color: #111827;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.dashboard-timeline p {
  margin-top: 2px;
  font-size: 12px;
  line-height: 18px;
}

@media (max-width: 1180px) {
  .dashboard-page__stats,
  .dashboard-modules {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-page__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .dashboard-page {
    padding: 16px;
  }

  .dashboard-page__stats,
  .dashboard-modules {
    grid-template-columns: 1fr;
  }

  .dashboard-page__grid {
    gap: 16px;
  }

  .dashboard-stat,
  .dashboard-panel__header,
  .dashboard-modules,
  .dashboard-actions {
    padding: 16px;
  }

  .dashboard-stat strong {
    font-size: 28px;
  }

  .dashboard-module {
    min-height: 86px;
  }
}
</style>
