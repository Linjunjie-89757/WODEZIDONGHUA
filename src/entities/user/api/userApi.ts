import { endpoints } from '@shared/api/endpoints';
import { request, withWorkspace } from '@shared/api/request';

import type { UserItem, UserProfile } from '../model/types';

export const userApi = {
  me() {
    return request.get<unknown, UserProfile>(endpoints.auth.me);
  },
  listUsers(workspaceCode = 'ALL') {
    return request.get<unknown, UserItem[]>(endpoints.user.list, withWorkspace(workspaceCode));
  }
};
