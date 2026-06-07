<template>
  <span>{{ name }}</span>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
}>();
</script>
