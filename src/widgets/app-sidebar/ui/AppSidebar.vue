<template>
  <a-layout-sider class="app-sidebar" :width="240">
    <div class="app-sidebar__brand">
      <div class="app-sidebar__logo">AT</div>
      <div class="app-sidebar__brand-copy">
        <strong>{{ t.common.appName }}</strong>
        <span>{{ t.common.appSubtitle }}</span>
      </div>
    </div>

    <nav class="app-sidebar__nav" aria-label="main navigation">
      <button
        v-for="item in appMenu"
        :key="item.key"
        type="button"
        :class="[
          'app-sidebar__item',
          { 'app-sidebar__item--active': selectedKey === item.key, 'app-sidebar__item--separated': item.separated }
        ]"
        @click="handleClick(item.key)"
      >
        <span class="app-sidebar__icon" :data-icon="item.icon"></span>
        <span>{{ item.label }}</span>
      </button>
    </nav>

    <div class="app-sidebar__user">
      <div class="app-sidebar__avatar">{{ t.common.userAvatarText }}</div>
      <div class="app-sidebar__user-copy">
        <strong>{{ t.common.superAdmin }}</strong>
        <span>SUPER_ADMIN</span>
      </div>
    </div>
  </a-layout-sider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { t } from '@shared/i18n';

import { appMenu } from '../model/menu';

const route = useRoute();
const router = useRouter();

const selectedKey = computed(() => {
  return (
    appMenu.find((item) => {
      const segment = item.path.split('/')[1];
      return route.path.startsWith(`/${segment}`);
    })?.key || 'dashboard'
  );
});

function handleClick(key: string) {
  const menu = appMenu.find((item) => item.key === key);

  if (menu) {
    router.push(menu.path);
  }
}
</script>

<style scoped>
.app-sidebar {
  position: relative;
  overflow: hidden;
  border-right: 0;
  background: #0f172a;
  color: #cbd5e1;
}

.app-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 56px;
  padding: 0 12px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);
}

.app-sidebar__logo,
.app-sidebar__avatar {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 700;
}

.app-sidebar__logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #3b82f6;
  font-size: 14px;
}

.app-sidebar__brand-copy,
.app-sidebar__user-copy {
  display: grid;
  min-width: 0;
}

.app-sidebar__brand-copy strong,
.app-sidebar__user-copy strong {
  overflow: hidden;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-sidebar__brand-copy span,
.app-sidebar__user-copy span {
  overflow: hidden;
  color: #93a4bc;
  font-size: 12px;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 8px;
}

.app-sidebar__item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 40px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #cbd5e1;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 0 10px;
  text-align: left;
}

.app-sidebar__item:hover {
  background: rgba(59, 130, 246, 0.14);
  color: #ffffff;
}

.app-sidebar__item--active {
  background: #3b82f6;
  color: #ffffff;
  font-weight: 700;
}

.app-sidebar__item--separated {
  margin-top: 8px;
  border-top: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 0;
  padding-top: 18px;
}

.app-sidebar__item--separated.app-sidebar__item--active,
.app-sidebar__item--separated:hover {
  border-radius: 6px;
}

.app-sidebar__icon {
  position: relative;
  width: 18px;
  height: 18px;
  color: currentColor;
  opacity: 0.9;
}

.app-sidebar__icon::before {
  content: "";
  position: absolute;
  inset: 2px;
  border: 1.8px solid currentColor;
  border-radius: 3px;
}

.app-sidebar__icon[data-icon="home"]::before {
  inset: 4px 3px 2px;
  border-top: 0;
}

.app-sidebar__icon[data-icon="home"]::after {
  content: "";
  position: absolute;
  left: 3px;
  top: 2px;
  width: 12px;
  height: 12px;
  border-top: 1.8px solid currentColor;
  border-left: 1.8px solid currentColor;
  transform: rotate(45deg);
}

.app-sidebar__icon[data-icon="bug"]::before {
  border-radius: 999px;
}

.app-sidebar__icon[data-icon="api"]::before {
  inset: 7px 2px;
  border-radius: 999px;
}

.app-sidebar__icon[data-icon="api"]::after {
  content: "";
  position: absolute;
  inset: 2px;
  border-left: 1.8px solid currentColor;
  border-right: 1.8px solid currentColor;
}

.app-sidebar__icon[data-icon="web"]::before {
  inset: 3px 1px 5px;
}

.app-sidebar__icon[data-icon="web"]::after {
  content: "";
  position: absolute;
  left: 6px;
  right: 6px;
  bottom: 1px;
  height: 1.8px;
  background: currentColor;
}

.app-sidebar__icon[data-icon="app"]::before {
  inset: 1px 4px;
  border-radius: 3px;
}

.app-sidebar__icon[data-icon="config"]::before {
  inset: 3px 1px;
  border-left: 0;
  border-right: 0;
  border-radius: 0;
}

.app-sidebar__icon[data-icon="settings"]::before {
  inset: 2px;
  border-radius: 999px;
}

.app-sidebar__user {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  height: 68px;
  padding: 0 16px;
  border-top: 1px solid rgba(148, 163, 184, 0.14);
}

.app-sidebar__avatar {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #6d5dfc;
  font-size: 14px;
}
</style>
