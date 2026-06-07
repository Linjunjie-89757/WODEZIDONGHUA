<template>
  <main class="auth-layout">
    <router-view />
  </main>
</template>

<style scoped>
.auth-layout {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: var(--app-spacing-xl);
  background:
    linear-gradient(135deg, rgba(22, 93, 255, 0.08), rgba(0, 168, 112, 0.08)),
    var(--app-color-bg);
}
</style>
