# Frontend Visual Restoration R0 Smoke Record

## Scope

R0 focuses on the login-after main shell and dashboard/home page.

Changed visual targets:

- Main shell follows `olddesign/src/app/App.tsx` structure.
- Sidebar keeps the olddesign 240px dark rail, 56px brand row, compact navigation rows and active blue state.
- Header keeps the olddesign 56px white top bar, compact title, workspace switcher, notification and user area.
- Dashboard is no longer a placeholder. It now uses olddesign-style workbench density: statistic cards, module entrance panel, quick actions, recent work table and restoration progress panel.

## Source Reference

- `D:\CodeProject\AutoTestHub\olddesign/src/app/App.tsx`
- `D:\CodeProject\AutoTestHub\docs/design-source-audit-olddesign.md`

## Files

- `src/app/layouts/MainLayout.vue`
- `src/widgets/app-sidebar/ui/AppSidebar.vue`
- `src/widgets/app-header/ui/AppHeader.vue`
- `src/pages/dashboard/ui/DashboardPage.vue`
- `src/shared/styles/tokens.css`
- `src/shared/i18n/zh-CN.ts`
- `docs/superpowers/plans/2026-06-08-frontend-visual-restoration.md`

## Verification

Commands to run:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run smoke:dashboard-visual
```

Scan commands:

```powershell
Select-String -Path src\**\*.ts,src\**\*.vue -Pattern '�|Ã|Â|鍦|璇|鎺|楠|绛'
Select-String -Path src\**\*.vue -Pattern '[\u4e00-\u9fff]'
```

## Screenshot Coverage

`scripts/smoke-dashboard-visual.mjs` captures:

- `output/playwright/dashboard-visual-desktop-<stamp>.png`
- `output/playwright/dashboard-visual-mobile-<stamp>.png`

The script checks login routing, dashboard shell text, page errors, console errors and horizontal overflow.

Latest run:

- `npm.cmd run typecheck`: passed.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed, with the existing Vite large chunk warning.
- `npm.cmd run smoke:dashboard-visual`: passed.
- Mojibake scan: passed.
- Chinese scatter scan: passed.
- Desktop screenshot: `output/playwright/dashboard-visual-desktop-20260607162908.png`
- Mobile screenshot: `output/playwright/dashboard-visual-mobile-20260607162908.png`
- Horizontal overflow: none on 1440x960 and 390x844.
- Page errors: none.
- Console note: one 401 resource message appears during auth probing and is recorded by the script, but it does not block the visual smoke.

## Remaining Deltas

- This is a first-pass shell/dashboard reproduction, not pixel-level old project reproduction.
- Sidebar collapse is still out of scope.
- Dashboard numbers are visual workbench placeholders until backend dashboard summary contract is introduced.
- Next implementation phase should move to Case Center visual shell using `olddesign/src/app/components/TestCasePage.tsx`.
