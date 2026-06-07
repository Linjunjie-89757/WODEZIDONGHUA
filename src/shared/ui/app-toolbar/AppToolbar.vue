<template>
  <div class="app-toolbar">
    <div class="app-toolbar__main">
      <slot />
    </div>
    <div v-if="$slots.extra" class="app-toolbar__extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<style scoped>
.app-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-spacing-md);
  min-width: 0;
}

.app-toolbar__main,
.app-toolbar__extra {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--app-spacing-sm);
  min-width: 0;
}
</style>
