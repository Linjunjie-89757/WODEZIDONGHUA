<template>
  <section class="dashboard-page">
    <div class="dashboard-page__placeholder">
      <div class="dashboard-page__icon">
        <span></span>
      </div>
      <p>{{ t.pages.dashboardPlaceholder }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
</script>

<style scoped>
.dashboard-page {
  display: grid;
  min-height: calc(100vh - 104px);
  place-items: center;
}

.dashboard-page__placeholder {
  display: grid;
  justify-items: center;
  width: min(520px, 100%);
  min-height: 140px;
  align-content: center;
  gap: 16px;
  border: 1px solid #dfe3ea;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.dashboard-page__icon {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 12px;
  background: #eff6ff;
}

.dashboard-page__icon span {
  position: relative;
  width: 18px;
  height: 18px;
  color: #2563eb;
}

.dashboard-page__icon span::before {
  content: "";
  position: absolute;
  inset: 7px 3px 2px;
  border: 2px solid currentColor;
  border-top: 0;
  border-radius: 2px;
}

.dashboard-page__icon span::after {
  content: "";
  position: absolute;
  left: 3px;
  top: 3px;
  width: 12px;
  height: 12px;
  border-top: 2px solid currentColor;
  border-left: 2px solid currentColor;
  transform: rotate(45deg);
}

.dashboard-page__placeholder p {
  margin: 0;
  color: #94a3b8;
  font-size: 14px;
}
</style>
