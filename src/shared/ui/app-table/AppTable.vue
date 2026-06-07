<template>
  <a-table
    v-bind="$attrs"
    :bordered="bordered"
    :pagination="pagination"
    :row-key="rowKey"
    class="app-table"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    bordered?: boolean;
    pagination?: boolean;
    rowKey?: string;
  }>(),
  {
    bordered: false,
    pagination: false,
    rowKey: 'id'
  }
);
</script>

<style scoped>
.app-table {
  width: 100%;
}
</style>
