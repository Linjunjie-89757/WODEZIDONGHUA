import type { RouteRecordRaw } from 'vue-router';

import AuthLayout from '@app/layouts/AuthLayout.vue';
import MainLayout from '@app/layouts/MainLayout.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: AuthLayout,
    meta: {
      public: true
    },
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@pages/login/ui/LoginPage.vue')
      }
    ]
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: {
          titleKey: 'dashboard'
        },
        component: () => import('@pages/dashboard/ui/DashboardPage.vue')
      },
      {
        path: 'system-settings/ai-connections',
        name: 'system-settings.ai-connections',
        meta: {
          titleKey: 'systemSettings'
        },
        component: () => import('@pages/system-settings/ui/AiConnectionsPage.vue')
      },
      {
        path: 'config-center',
        name: 'config-center',
        meta: {
          titleKey: 'configCenter'
        },
        component: () => import('@pages/config-center/ui/ConfigCenterPage.vue')
      },
      {
        path: 'case-center',
        name: 'case-center',
        meta: {
          titleKey: 'caseCenter'
        },
        component: () => import('@pages/case-center/ui/CaseCenterPage.vue')
      },
      {
        path: 'case-ai-record-detail/:id',
        name: 'case-ai-record-detail',
        component: () => import('@pages/case-ai-record-detail/ui/CaseAiRecordDetailPage.vue')
      },
      {
        path: 'bug-management',
        name: 'bug-management',
        meta: {
          titleKey: 'bugManagement'
        },
        component: () => import('@pages/bug-management/ui/BugManagementPage.vue')
      },
      {
        path: 'bug-detail/:id',
        name: 'bug-detail',
        component: () => import('@pages/bug-detail/ui/BugDetailPage.vue')
      },
      {
        path: 'api-automation',
        name: 'api-automation',
        meta: {
          titleKey: 'apiAutomation'
        },
        component: () => import('@pages/api-automation/ui/ApiAutomationPage.vue')
      },
      {
        path: 'web-automation',
        name: 'web-automation',
        meta: {
          titleKey: 'webAutomation'
        },
        component: () => import('@pages/web-automation/ui/WebAutomationPage.vue')
      },
      {
        path: 'app-automation',
        name: 'app-automation',
        meta: {
          titleKey: 'appAutomation'
        },
        component: () => import('@pages/app-automation/ui/AppAutomationPage.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];
