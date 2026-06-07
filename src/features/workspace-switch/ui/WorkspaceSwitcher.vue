<template>
  <WorkspaceSelect
    class="workspace-switcher"
    :loading="loading"
    :model-value="currentWorkspace.code"
    :options="workspaceOptions"
    @update:model-value="switchWorkspace"
  />
</template>

<script setup lang="ts">
import { WorkspaceSelect } from '@entities/workspace';

import { useWorkspaceSwitch } from '../model/useWorkspaceSwitch';

const { currentWorkspace, workspaceOptions, loading, switchWorkspace } = useWorkspaceSwitch();
</script>

<style scoped>
.workspace-switcher {
  width: 180px;
}
</style>
