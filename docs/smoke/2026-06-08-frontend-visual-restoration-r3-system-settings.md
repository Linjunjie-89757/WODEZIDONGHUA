# Frontend Visual Restoration R3 System Settings Smoke Record

## Scope

R3 focuses on System Settings visual restoration:

- AI 连接
- 空间管理

## Source Reference

- `D:\CodeProject\AutoTestHub\olddesign\src\app\components\SettingsPage.tsx`
- `D:\CodeProject\AutoTestHub\olddesign\src\app\components\WorkspaceConfig.tsx`

## Changes

- System Settings now uses the olddesign-like second-level settings shell: 224px left settings nav and full workbench content area.
- AI connection pool keeps existing backend CRUD/test capabilities but restores olddesign-like stats, connection cards and provider grid density.
- Workspace management adds a real readonly workspace panel backed by `workspaceApi.list()`.
- Workspace create/edit/member actions are intentionally disabled or visual-only until write contract is confirmed.

## Verification

Latest run:

- `npm.cmd run typecheck`: passed.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed, with the existing Vite large chunk warning.
- `npm.cmd run smoke:system-settings-visual`: passed.

Smoke screenshots:

- Desktop AI settings: `output/playwright/system-settings-ai-desktop-20260607170127.png`
- Mobile AI settings: `output/playwright/system-settings-ai-mobile-20260607170127.png`
- Desktop workspace settings: `output/playwright/system-settings-workspace-desktop-20260607170127.png`
- Mobile workspace settings: `output/playwright/system-settings-workspace-mobile-20260607170127.png`

Smoke assertions:

- Login routing reached `/system-settings/ai-connections`.
- `AI 连接` nav and `AI 连接池` page are visible.
- `支持的供应商` provider grid is visible.
- `空间管理` nav switches to workspace page.
- `工作空间配置` and `空间总数` are visible.
- Horizontal overflow: none on 1440x960 and 390x844.
- Page errors: none.

Console note:

- One 401 resource message appears during auth probing and is recorded by the script, but it does not block this visual smoke.

## Remaining Deltas

- Workspace write actions require old backend contract confirmation before implementation.
- The AI connection modal itself still uses the current Feature-Sliced dialog flow; only the page shell/cards/grid were restored in R3.
