<template>
  <a-layout-header class="app-header">
    <div class="app-header__left">
      <h1>{{ currentTitle }}</h1>
      <span class="app-header__divider"></span>
      <WorkspaceSwitcher />
    </div>
    <div class="app-header__right">
      <button type="button" class="app-header__notice" :aria-label="t.common.notifications">
        <span></span>
      </button>
      <div class="app-header__user">
        <span class="app-header__avatar">{{ t.common.userAvatarText }}</span>
        <strong>{{ t.common.superAdmin }}</strong>
        <span class="app-header__caret"></span>
      </div>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { WorkspaceSwitcher } from '@features/workspace-switch';
import { t } from '@shared/i18n';

const route = useRoute();

const currentTitle = computed(() => {
  const key = route.meta.titleKey as keyof typeof t.navigation | undefined;
  return key ? t.navigation[key] : t.navigation.dashboard;
});
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
}

.app-header__left,
.app-header__right,
.app-header__user {
  display: flex;
  align-items: center;
  min-width: 0;
}

.app-header__left {
  gap: 12px;
}

.app-header__left h1 {
  margin: 0;
  color: #0f172a;
  font-size: 16px;
  font-weight: 600;
  line-height: 56px;
}

.app-header__divider {
  width: 1px;
  height: 18px;
  background: #e5e7eb;
}

.app-header__left :deep(.workspace-switcher) {
  width: 180px;
}

.app-header__left :deep(.arco-select-view-single) {
  min-height: 32px;
  border-color: #e5e7eb;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 13px;
}

.app-header__right {
  gap: 8px;
}

.app-header__notice {
  position: relative;
  width: 32px;
  height: 32px;
  border: 0;
  border-right: 1px solid #e5e7eb;
  background: transparent;
  cursor: pointer;
  padding: 0 14px 0 0;
}

.app-header__notice::before {
  content: "";
  position: absolute;
  left: 8px;
  top: 8px;
  width: 12px;
  height: 14px;
  border: 1.6px solid #64748b;
  border-radius: 8px 8px 4px 4px;
}

.app-header__notice::after {
  content: "";
  position: absolute;
  left: 13px;
  top: 23px;
  width: 4px;
  height: 2px;
  border-radius: 999px;
  background: #64748b;
}

.app-header__notice span {
  position: absolute;
  left: 19px;
  top: 6px;
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: #ef4444;
}

.app-header__user {
  gap: 8px;
  color: #1f2937;
  font-size: 14px;
  min-height: 36px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  padding: 0 8px;
  transition: background 0.18s ease;
}

.app-header__user:hover {
  background: #f3f4f6;
}

.app-header__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #6d5dfc;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
}

.app-header__user strong {
  font-weight: 500;
}

.app-header__caret {
  width: 6px;
  height: 6px;
  border-right: 1.5px solid #94a3b8;
  border-bottom: 1.5px solid #94a3b8;
  transform: rotate(45deg) translateY(-2px);
}

@media (max-width: 720px) {
  .app-header {
    gap: 8px;
    padding: 0 10px;
  }

  .app-header__left {
    flex: 1;
    gap: 8px;
  }

  .app-header__left h1 {
    max-width: 64px;
    overflow: hidden;
    font-size: 15px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .app-header__left :deep(.workspace-switcher) {
    width: 96px;
  }

  .app-header__right {
    gap: 4px;
  }

  .app-header__notice {
    width: 28px;
    padding-right: 8px;
  }

  .app-header__user {
    padding: 0 4px;
  }

  .app-header__user strong,
  .app-header__caret {
    display: none;
  }
}
</style>
