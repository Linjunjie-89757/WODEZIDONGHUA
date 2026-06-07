<template>
  <section class="app-section">
    <header v-if="title || description || $slots.actions" class="app-section__header">
      <div>
        <h2 v-if="title" class="app-section__title">{{ title }}</h2>
        <p v-if="description" class="app-section__description">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="app-section__actions">
        <slot name="actions" />
      </div>
    </header>
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
}>();
</script>

<style scoped>
.app-section {
  display: grid;
  gap: var(--app-spacing-md);
  min-width: 0;
}

.app-section__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--app-spacing-md);
}

.app-section__title {
  margin: 0;
  font-size: 16px;
  font-weight: 650;
  line-height: 1.4;
}

.app-section__description {
  margin: 4px 0 0;
  color: var(--app-color-text-muted);
  line-height: 1.5;
}

.app-section__actions {
  display: flex;
  gap: var(--app-spacing-sm);
}
</style>
