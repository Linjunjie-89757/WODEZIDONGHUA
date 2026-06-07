<template>
  <aside class="settings-sidebar">
    <p class="settings-sidebar__eyebrow">{{ t.systemSettings.categoryTitle }}</p>
    <button
      v-for="item in settingsMenu"
      :key="item.key"
      type="button"
      :class="['settings-sidebar__item', { 'is-active': item.key === activeKey }]"
      @click="emit('update:activeKey', item.key)"
    >
      <span class="settings-sidebar__icon">{{ item.label.slice(0, 1) }}</span>
      <span>
        <strong>{{ item.label }}</strong>
        <small>{{ item.description }}</small>
      </span>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';

import { settingsMenu } from '../model/settingsMenu';

defineProps<{
  activeKey: string;
}>();

const emit = defineEmits<{
  'update:activeKey': [key: string];
}>();
</script>

<style scoped>
.settings-sidebar {
  width: 224px;
  min-width: 224px;
  overflow: hidden;
  border-right: 1px solid #e5e7eb;
  background: #ffffff;
  padding: 16px 12px;
}

.settings-sidebar__eyebrow {
  margin: 0 0 10px;
  color: #9ca3af;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
  padding: 0 12px;
}

.settings-sidebar__item {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #4b5563;
  cursor: pointer;
  gap: 12px;
  margin-bottom: 2px;
  padding: 10px 12px;
  text-align: left;
  transition:
    background 0.18s ease,
    color 0.18s ease;
}

.settings-sidebar__item:hover {
  background: #f9fafb;
  color: #111827;
}

.settings-sidebar__item.is-active {
  background: #eff6ff;
  color: #1d4ed8;
}

.settings-sidebar__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 8px;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
}

.settings-sidebar__item.is-active .settings-sidebar__icon {
  background: #dbeafe;
  color: #2563eb;
}

.settings-sidebar__item span:last-child {
  min-width: 0;
}

.settings-sidebar__item strong,
.settings-sidebar__item small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.settings-sidebar__item strong {
  font-size: 14px;
  font-weight: 650;
}

.settings-sidebar__item small {
  margin-top: 2px;
  color: #9ca3af;
  font-size: 12px;
}
</style>
