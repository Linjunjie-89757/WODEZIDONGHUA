<template>
  <section class="app-page">
    <header v-if="$slots.title || title || description || $slots.actions" class="app-page__header">
      <div class="app-page__heading">
        <slot name="title">
          <h1 v-if="title" class="app-page__title">{{ title }}</h1>
        </slot>
        <p v-if="description" class="app-page__description">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="app-page__actions">
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
.app-page {
  display: grid;
  gap: var(--app-spacing-lg);
  min-width: 0;
}

.app-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--app-spacing-lg);
  min-width: 0;
}

.app-page__heading {
  min-width: 0;
}

.app-page__title {
  margin: 0;
  font-size: 20px;
  font-weight: 650;
  line-height: 1.3;
}

.app-page__description {
  margin: 6px 0 0;
  color: var(--app-color-text-muted);
  line-height: 1.6;
}

.app-page__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--app-spacing-sm);
}
</style>
