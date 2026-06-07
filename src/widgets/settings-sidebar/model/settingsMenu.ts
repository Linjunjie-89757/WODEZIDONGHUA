import { t } from '@shared/i18n';

export const settingsMenu = [
  {
    key: 'ai-connections',
    label: t.navigation.aiConnection,
    description: t.systemSettings.aiConnectionMenuDescription,
    path: '/system-settings/ai-connections'
  },
  {
    key: 'workspaces',
    label: t.systemSettings.workspaceMenu,
    description: t.systemSettings.workspaceMenuDescription,
    path: '/system-settings/ai-connections'
  }
];
