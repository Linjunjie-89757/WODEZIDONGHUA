import { request } from '@shared/api/request';
import { endpoints } from '@shared/api/endpoints';

import type { Workspace } from '../model/types';

export const workspaceApi = {
  list() {
    return request.get<unknown, Workspace[]>(endpoints.workspace.list);
  },
  listSwitchable() {
    return request.get<unknown, Workspace[]>(endpoints.workspace.switchable);
  }
};
