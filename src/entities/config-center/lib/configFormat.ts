import { t } from '@shared/i18n';

import type { ConfigCenterStatus } from '../model/types';

export function getConfigStatus(status?: number): ConfigCenterStatus {
  if (status === 1) {
    return 'enabled';
  }

  if (status === 0) {
    return 'disabled';
  }

  return 'error';
}

export function getConfigStatusLabel(status?: number) {
  const normalized = getConfigStatus(status);
  const labels: Record<ConfigCenterStatus, string> = {
    enabled: t.configCenter.statusEnabled,
    disabled: t.configCenter.statusDisabled,
    error: t.configCenter.statusError
  };

  return labels[normalized];
}

export function getConfigStatusColor(status?: number) {
  const normalized = getConfigStatus(status);
  const colors: Record<ConfigCenterStatus, string> = {
    enabled: 'green',
    disabled: 'gray',
    error: 'red'
  };

  return colors[normalized];
}
