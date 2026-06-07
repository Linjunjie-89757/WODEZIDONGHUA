# Frontend Visual Restoration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore AutoTestHub 2.0 visual experience from the Figma/Make export in `olddesign`, while keeping the new Vue/TypeScript architecture and old backend contracts.

**Architecture:** Treat `olddesign` as the visual mother source, old frontend screenshots as runtime truth, and old frontend/backend code as behavior and contract reference. Implement in Vue 3 + Arco through Feature-Sliced Lite boundaries: pages compose, widgets own large page regions, features own actions, entities own contracts, shared owns tokens/ui/i18n.

**Tech Stack:** Vue 3, TypeScript, Vite, Pinia, Vue Router, Arco Design Vue, Feature-Sliced Lite, Playwright smoke scripts.

---

## Source Priority

1. `D:\CodeProject\AutoTestHub\olddesign`: visual tokens, layout dimensions, component density and page composition.
2. `http://localhost:4173`: old frontend runtime screenshots when available.
3. `D:\CodeProject\AutoTestHub\reference\old-auto`: copied old project source and knowledge graph for behavior and API clues.
4. `D:\CodeProject\auto`: read-only old backend/front-end when explicitly needed and allowed.
5. `D:\CodeProject\AutoTestHub`: only writable project.

Do not copy React state/store logic from `olddesign`. Translate layout and visual structure into existing Vue + Arco + Feature-Sliced Lite modules.

## Global Visual Contract

- Main sidebar width: `240px`.
- Main header height: `56px`.
- App background: `#f5f6f8` / gray-50 family.
- Sidebar background: `#0f172a` / slate-900.
- Product accent: `#2563eb` / blue-600.
- Main table header height: `40px`.
- Dense table row height: `40px` to `48px`.
- Form input height: `34px` to `38px`.
- Standard radius: `8px` to `10px`; modal/drawer panels may use `12px` to `16px`.
- Main content should feel like a testing workbench: compact rails, tables, toolbars and drawers, not marketing cards.

## Task R0: Main Shell And Dashboard

**Files:**
- Modify: `src/app/layouts/MainLayout.vue`
- Modify: `src/widgets/app-sidebar/ui/AppSidebar.vue`
- Modify: `src/widgets/app-header/ui/AppHeader.vue`
- Modify: `src/pages/dashboard/ui/DashboardPage.vue`
- Modify: `src/shared/styles/tokens.css`
- Modify: `src/shared/i18n/zh-CN.ts`
- Add: `docs/smoke/2026-06-08-frontend-visual-restoration-r0.md`

- [ ] Read `olddesign/src/app/App.tsx` and record exact shell dimensions.
- [ ] Align the sidebar to olddesign: 240px, 56px brand row, `px-2 py-3` nav area, `px-2 py-2.5` nav rows, active blue item, divider before config center, compact bottom user row.
- [ ] Align the top header to olddesign: 56px height, white background, page title `16px/600`, workspace switcher, notification and user area.
- [ ] Replace the dashboard placeholder with an olddesign-style workbench landing page: stat cards, module entry shell, recent activity table and compact quick actions.
- [ ] Keep all Chinese labels in `src/shared/i18n/zh-CN.ts`.
- [ ] Capture before/after screenshots and record remaining differences.
- [ ] Run `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`, encoding scan, Chinese scatter scan and boundary scan.
- [ ] Commit only AutoTestHub source/docs changes, excluding `olddesign/` and `reference/`.

## Task R1: Case Management Visual Shell

**Files:**
- Modify: `src/pages/case-center/ui/CaseCenterPage.vue`
- Modify: `src/widgets/case-center-readonly/ui/CaseCenterReadonly.vue`
- Modify: `src/widgets/case-center-readonly/ui/CaseDirectoryTree.vue`
- Modify: `src/widgets/case-center-readonly/ui/CaseDirectoryNodeItem.vue`
- Modify: `src/widgets/case-center-readonly/ui/CaseReadonlyList.vue`
- Modify: `src/shared/i18n/zh-CN.ts`
- Add or update: `scripts/smoke-case-center-visual.mjs`
- Add: `docs/smoke/2026-06-08-frontend-visual-restoration-r1-case-management.md`

- [ ] Read `olddesign/src/app/components/TestCasePage.tsx` for tree rail, toolbar, table and drawer density.
- [ ] Align the case center outer shell: left directory rail, right case table, compact toolbar, border and background rhythm.
- [ ] Keep existing case CRUD/directory CRUD behavior and backend contract.
- [ ] Make directory rows match olddesign: `py-1.5`, `level * 14 + 8` indentation, hover actions, folder icon treatment.
- [ ] Make case table match olddesign density: 40px header, 40-48px rows, sticky action column where needed, compact status/priority badges.
- [ ] Record screenshot comparison and remaining deltas.

## Task R2: Case AI Pages

**Files:**
- Create or modify widgets/features under `src/widgets/case-ai-*`, `src/features/case-ai-*`, and `src/entities/case-center` only after contract is confirmed.
- Modify: `src/pages/case-center/ui/CaseCenterPage.vue`
- Modify: `src/pages/case-ai-record-detail/ui/CaseAiRecordDetailPage.vue`
- Modify: `src/shared/api/endpoints.ts`
- Modify: `src/shared/i18n/zh-CN.ts`
- Add: `docs/case-ai-contract.md`
- Add: `docs/smoke/2026-06-08-frontend-visual-restoration-r2-case-ai.md`

- [ ] Read old frontend/backend contract for AI case generation, generation record list/detail and AI config. Do not guess endpoints.
- [ ] Use `olddesign/src/app/components/AiConfigPage.tsx` for AI config visual structure.
- [ ] Use `olddesign/src/app/components/AiHistoryPage.tsx` for AI generation record visual structure.
- [ ] Implement only contract-backed views/actions.
- [ ] If backend contract is missing for a visual area, render a read-only shell and record the blocker in docs.

## Task R3: System Settings

**Files:**
- Modify: `src/pages/system-settings/ui/AiConnectionsPage.vue`
- Modify: `src/widgets/settings-sidebar/ui/SettingsSidebar.vue`
- Modify: `src/widgets/settings-sidebar/model/settingsMenu.ts`
- Modify: `src/widgets/ai-connection-pool/ui/*.vue`
- Create or modify workspace management modules after contract is confirmed.
- Modify: `src/shared/i18n/zh-CN.ts`
- Add: `docs/workspace-management-contract.md`
- Add: `docs/smoke/2026-06-08-frontend-visual-restoration-r3-system-settings.md`

- [ ] Read `olddesign/src/app/components/SettingsPage.tsx` for settings side navigation and AI connection layout.
- [ ] Read `olddesign/src/app/components/WorkspaceConfig.tsx` for workspace management visual structure.
- [ ] Align AI connection cards, provider grid, status badges, side nav and dialogs to olddesign.
- [ ] Read old backend contract before implementing workspace management. Do not invent endpoints.
- [ ] Keep AI connection CRUD behavior unchanged.

## Task R4: Config Center

**Files:**
- Modify: `src/pages/config-center/ui/ConfigCenterPage.vue`
- Modify: `src/widgets/config-center-overview/ui/ConfigCenterOverview.vue`
- Modify: `src/widgets/config-center-overview/ui/ConfigListPanel.vue`
- Modify: `src/widgets/config-center-overview/ui/ConfigListItem.vue`
- Modify existing config create/edit/delete features only if visual shell requires it.
- Modify: `src/shared/i18n/zh-CN.ts`
- Add: `docs/smoke/2026-06-08-frontend-visual-restoration-r4-config-center.md`

- [ ] Read `olddesign/src/app/components/ConfigCenterPage.tsx` for env, parameter set and database connection layouts.
- [ ] Keep existing environment, parameter set and database connection CRUD contracts.
- [ ] Align config navigation, stat cards, list cards, modals, form fields, badges and action rows to olddesign.
- [ ] Ensure three config pages remain independently smoke-testable.

## Task R5: Shared Token And Component Backfill

**Files:**
- Modify: `src/shared/styles/tokens.css`
- Modify: `src/shared/styles/global.css`
- Modify: selected `src/shared/ui/*` only when repeated patterns have stabilized.
- Add: `docs/frontend-visual-restoration-system.md`

- [ ] Extract proven dimensions and colors from R0-R4 into tokens.
- [ ] Keep shared/ui thin unless at least two completed pages use the same structure.
- [ ] Document button, table, drawer, dialog, toolbar and status badge rules.
- [ ] Do not change unrelated modules in this phase.

## Verification Commands

Run these after each implementation phase when local services are available:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

Run relevant smoke scripts:

```powershell
npm.cmd run smoke:case-center-visual
npm.cmd run smoke:config-center-visual
```

If a smoke script does not exist for the phase, add or update one before calling the phase complete.

Run scan checks:

```powershell
Select-String -Path src\**\*.ts,src\**\*.vue -Pattern '�|Ã|Â|鍦|璇|鎺|楠|绛'
Select-String -Path src\**\*.vue -Pattern '[\u4e00-\u9fff]'
```

The Chinese scatter scan may report intentional strings in `src/shared/i18n/zh-CN.ts`; visible UI copy outside that file should be moved back to i18n.

## Commit Rules

- Commit each completed phase separately.
- Do not commit `olddesign/` or `reference/` unless the user explicitly asks.
- Commit smoke docs and screenshot records with the implementation they verify.
- If old frontend/backend services are unavailable, document the blocker and still run static verification.
