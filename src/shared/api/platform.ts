import { request } from './request';

export const platformApi = {
  health() {
    return request.get('/health');
  }
};
