import { t } from '@shared/i18n';

export const appMenu = [
  {
    key: 'dashboard',
    label: t.navigation.dashboard,
    path: '/dashboard',
    icon: 'home'
  },
  {
    key: 'case-center',
    label: t.navigation.caseCenter,
    path: '/case-center',
    icon: 'case'
  },
  {
    key: 'bug-management',
    label: t.navigation.bugManagement,
    path: '/bug-management',
    icon: 'bug'
  },
  {
    key: 'api-automation',
    label: t.navigation.apiAutomation,
    path: '/api-automation',
    icon: 'api'
  },
  {
    key: 'web-automation',
    label: t.navigation.webAutomation,
    path: '/web-automation',
    icon: 'web'
  },
  {
    key: 'app-automation',
    label: t.navigation.appAutomation,
    path: '/app-automation',
    icon: 'app'
  },
  {
    key: 'config-center',
    label: t.navigation.configCenter,
    path: '/config-center',
    icon: 'config'
  },
  {
    key: 'system-settings',
    label: t.navigation.systemSettings,
    path: '/system-settings/ai-connections',
    icon: 'settings',
    separated: true
  }
];
