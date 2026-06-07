<template>
  <a-tag color="arcoblue">{{ name }}</a-tag>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
}>();
</script>
