import { endpoints } from '@shared/api/endpoints';
import { request } from '@shared/api/request';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResult {
  id: number;
  username: string;
  displayName: string;
  roleCode: string;
  workspaceCodes: string[];
}

export const loginApi = {
  login(payload: LoginPayload) {
    return request.post<unknown, LoginResult>(endpoints.auth.login, payload);
  }
};
