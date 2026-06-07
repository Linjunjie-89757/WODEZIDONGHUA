# Frontend Visual Restoration R2 Case AI Smoke Record

## Scope

R2 focuses on Case Center AI pages under the existing Case Center workbench:

- AI 用例生成
- AI 生成记录
- AI 配置

## Source Reference

- `D:\CodeProject\AutoTestHub\olddesign\src\app\components\TestCasePage.tsx`
- `D:\CodeProject\AutoTestHub\olddesign\src\app\components\AiHistoryPage.tsx`
- `D:\CodeProject\AutoTestHub\olddesign\src\app\components\AiConfigPage.tsx`
- `D:\CodeProject\AutoTestHub\reference\old-auto\api.ts`
- `D:\CodeProject\AutoTestHub\reference\old-auto\knowledge-graph.json`
- `D:\CodeProject\AutoTestHub\docs\case-ai-contract.md`

## Changes

- Added olddesign-like AI generation shell with requirement form, output options, process cards and result empty state.
- Added olddesign-like AI generation records shell with stats row, status filter and dense task table.
- Added olddesign-like AI config shell with generator/reviewer role cards.
- AI config now reads real AI connection pool data through `entities/ai-model`.
- Chinese copy remains in `src/shared/i18n/zh-CN.ts`.

## Contract Notes

- `reference/old-auto/api.ts` confirms `AiGenerationTask`, `AiGenerationTaskEvent`, `CreateAiGenerationTaskPayload`, `UpdateAiGenerationTaskPayload`, `AiGeneratedCase` and related task statuses.
- The new frontend currently only has confirmed AI connection pool endpoints under `endpoints.aiModel`.
- R2 does not guess Case AI task endpoint paths, so generation/history remain visual shells until controller contract is copied or confirmed.
- AI role config persistence is not implemented because the Case AI config endpoint is not confirmed in the new frontend contract.

## Verification

Latest run:

- `npm.cmd run typecheck`: passed.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed, with the existing Vite large chunk warning.
- `npm.cmd run smoke:case-center-visual`: passed.
- mojibake scan: passed.
- Chinese scatter scan: passed.
- light Feature-Sliced boundary scan: passed.

Smoke assertions:

- Login routing reaches `/case-center`.
- `用例管理` tab remains functional.
- `AI 用例生成` shows generation shell, process area and result area.
- `AI 生成记录` shows stats and task table.
- `AI 配置` shows generator/reviewer cards and role prompt fields.
- Horizontal overflow is checked on desktop and mobile viewports.

Smoke screenshots:

- Desktop case management screenshot: `output/playwright/case-center-module-desktop-20260607165325.png`
- Mobile case management screenshot: `output/playwright/case-center-module-mobile-20260607165325.png`
- Desktop AI tab screenshot: `output/playwright/case-center-ai-desktop-20260607165325.png`
- Mobile AI tab screenshot: `output/playwright/case-center-ai-mobile-20260607165325.png`

Console note:

- One 401 resource message appears during auth probing and is recorded by the script, but it does not block this visual smoke.
