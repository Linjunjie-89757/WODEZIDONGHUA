# Frontend Visual Restoration R1 Case Management Smoke Record

## Scope

R1 focuses on the Case Center case management visual shell.

Changed visual targets:

- Case Center now follows `olddesign/src/app/components/TestCasePage.tsx` workbench composition.
- Top tab strip includes `用例管理`, `AI 用例生成`, `AI 生成记录`, `AI 配置`.
- Case management uses a 256px left category rail and a right work area.
- Directory rows use compact olddesign-style folder rows with hover actions.
- Case list uses a dense table with 40px header, 48px rows, compact badges and sticky action column.
- Mobile viewport collapses to a readable rail + card/table flow without horizontal page overflow.

## Source Reference

- `D:\CodeProject\AutoTestHub\olddesign/src/app/components/TestCasePage.tsx`
- `D:\CodeProject\AutoTestHub\docs/design-source-audit-olddesign.md`
- `D:\CodeProject\AutoTestHub\docs/superpowers/plans/2026-06-08-frontend-visual-restoration.md`

## Files

- `package.json`
- `scripts/smoke-case-center-visual.mjs`
- `src/pages/case-center/ui/CaseCenterPage.vue`
- `src/widgets/case-center-readonly/ui/CaseCenterReadonly.vue`
- `src/widgets/case-center-readonly/ui/CaseDirectoryTree.vue`
- `src/widgets/case-center-readonly/ui/CaseDirectoryNodeItem.vue`
- `src/widgets/case-center-readonly/ui/CaseReadonlyList.vue`
- `src/shared/i18n/zh-CN.ts`

## Verification

Latest run:

- `npm.cmd run typecheck`: passed.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed, with the existing Vite large chunk warning.
- `npm.cmd run smoke:case-center-visual`: passed.

Smoke screenshots:

- Desktop screenshot: `output/playwright/case-center-module-desktop-20260607164146.png`
- Mobile screenshot: `output/playwright/case-center-module-mobile-20260607164146.png`

Smoke assertions:

- Login routing reached `/case-center`.
- `用例管理` tab is visible.
- `用例分类` rail is visible.
- Case search input is visible.
- Table `编号` and `操作` headers are visible.
- Horizontal overflow: none on 1440x960 and 390x844.
- Page errors: none.

Console note:

- One 401 resource message appears during auth probing and is recorded by the script, but it does not block this visual smoke.

## Remaining Deltas

- AI case generation, AI generation records and AI config are only tab entrances in R1. R2 must read old frontend/backend contract before implementing real pages.
- Current search/filter controls are visual shell controls. Data filtering still follows existing backend list behavior.
- Existing case create/edit still uses the established dialog flow, not the olddesign 480px right drawer yet.
- This is visual alignment, not pixel-level reproduction.
