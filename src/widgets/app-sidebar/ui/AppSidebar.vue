<template>
  <a-layout-sider class="app-sidebar" :width="220">
    <div class="app-sidebar__brand">AutoTestHub</div>
    <a-menu :selected-keys="[selectedKey]" @menu-item-click="handleClick">
      <a-menu-item v-for="item in appMenu" :key="item.key">{{ item.label }}</a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { appMenu } from '../model/menu';

const route = useRoute();
const router = useRouter();

const selectedKey = computed(() => {
  return (
    appMenu.find((item) => {
      const segment = item.path.split('/')[1];
      return route.path.startsWith(`/${segment}`);
    })?.key || 'system-settings'
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
  border-right: 1px solid var(--app-color-border);
  background: var(--app-color-surface);
}

.app-sidebar__brand {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 var(--app-spacing-lg);
  border-bottom: 1px solid var(--app-color-border);
  font-size: 16px;
  font-weight: 700;
}
</style>
