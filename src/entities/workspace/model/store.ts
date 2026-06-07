import { defineStore } from 'pinia';

import { t } from '@shared/i18n';

import { workspaceApi } from '../api/workspaceApi';
import type { Workspace } from './types';

const allWorkspace: Workspace = {
  code: 'ALL',
  name: t.workspace.all,
  allScope: true,
  workspaceType: 'GLOBAL',
  status: 1
};

export const useWorkspaceStore = defineStore('workspace', {
  state: () => ({
    currentWorkspace: allWorkspace,
    switchableWorkspaces: [] as Workspace[],
    loading: false,
    loaded: false
  }),
  getters: {
    workspaceOptions: (state) => {
      const workspaces = state.switchableWorkspaces.length
        ? state.switchableWorkspaces
        : [state.currentWorkspace];

      return workspaces.map((workspace) => ({
        label: workspace.name,
        value: workspace.code
      }));
    },
    writableWorkspaceCode: (state) => {
      if (!state.currentWorkspace.allScope) {
        return state.currentWorkspace.code;
      }

      return state.switchableWorkspaces.find((workspace) => !workspace.allScope)?.code || '';
    }
  },
  actions: {
    setCurrentWorkspace(workspaceCode: string) {
      const next = this.switchableWorkspaces.find((workspace) => workspace.code === workspaceCode);

      if (next) {
        this.currentWorkspace = next;
      }
    },
    async loadSwitchable() {
      this.loading = true;

      try {
        const workspaces = await workspaceApi.listSwitchable();
        this.switchableWorkspaces = workspaces.length ? workspaces : [allWorkspace];
        this.currentWorkspace =
          this.switchableWorkspaces.find(
            (workspace) => workspace.code === this.currentWorkspace.code
          ) || this.switchableWorkspaces[0];
        this.loaded = true;
      } finally {
        this.loading = false;
      }
    },
    async ensureSwitchableLoaded() {
      if (!this.loaded && !this.loading) {
        await this.loadSwitchable();
      }
    },
    reset() {
      this.currentWorkspace = allWorkspace;
      this.switchableWorkspaces = [];
      this.loaded = false;
      this.loading = false;
    }
  }
});
