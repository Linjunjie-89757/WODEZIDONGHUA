# API Run Result Panel Smoke

Date: 2026-06-07

## Scope

This smoke record covers the shared API Automation run result panel abstraction.

Covered:

- API definition debug result display.
- API case run result display.
- API scenario run result display.
- response status, duration, response headers, response body, assertion results, processor results, extraction results, multi-step results, and raw result JSON.
- screenshot capture and horizontal overflow checks through existing smoke scripts.

Explicitly out of scope:

- new API execution capabilities.
- advanced scenario controllers.
- AI generation.
- scenario editor behavior changes.

## Frontend Changes

- `src/widgets/api-run-result-panel`
  - adds `ApiRunResultPanel`.
  - consumes the existing `ApiRunResponse` contract from `entities/api-automation`.
  - exposes stable smoke selectors: `api-run-result-panel`, `api-run-result-status`, `api-run-result-response-body`, `api-run-result-assertion-results`, `api-run-result-processor-results`, and `api-run-result-steps`.
- `src/features/api-definition-debug`
  - now owns only the debug action and emits the `ApiRunResponse`.
  - no longer renders duplicated result markup.
- `src/widgets/api-automation-shell`
  - composes the definition debug action and shared run result panel.
- `src/widgets/api-case-management`
  - renders API case run output through the shared panel.
- `src/widgets/api-scenario-management`
  - renders API scenario run output through the shared panel.
- `scripts/smoke-api-automation-phase1-3.mjs`
  - verifies definition debug result through shared panel selectors.
- `scripts/smoke-api-automation-phase5-7.mjs`
  - hardens case and scenario run checks to require shared panel internals instead of only checking the outer result section.

## Boundary Notes

- `features/api-definition-debug` does not import `widgets/api-run-result-panel`.
- shared panel composition stays in widgets.
- Chinese UI text remains under `src/shared/i18n/zh-CN.ts`.
- Arco feedback flow was not changed in this abstraction.

## Smoke Execution

Definition debug:

```powershell
$env:SMOKE_BASE_URL='http://localhost:5173'; node scripts\smoke-api-automation-phase1-3.mjs
```

Result:

- Status: pass.
- Screenshot: `output/playwright/api-automation-phase1-4-20260607044727.png`.
- Verified shared panel selectors for status, response body, assertion tab, and assertion results.
- Page errors: none.
- Horizontal overflow: none.
- Console note: one expected pre-login `GET /api/auth/me` 401 appears before successful login.

Case run and scenario run:

```powershell
$env:SMOKE_BASE_URL='http://localhost:5173'; node scripts\smoke-api-automation-phase5-7.mjs
```

Result:

- Status: pass.
- Screenshot: `output/playwright/api-automation-phase5-7-20260607045105.png`.
- Verified API case run result renders `api-run-result-panel`, `api-run-result-status`, and `api-run-result-response-body`.
- Verified API scenario run result renders `api-run-result-panel`, `api-run-result-status`, `api-run-result-response-body`, and `api-run-result-steps`.
- Page errors: none.
- Horizontal overflow: none.
- Cleanup: pass; script deletes smoke scenarios, cases, and definitions in dependency order.
- Console note: one expected pre-login `GET /api/auth/me` 401 appears before successful login.

## Verification

Completed:

- `npm.cmd run lint`
- `npm.cmd run build`
- source Chinese string scan outside `src/shared/i18n/zh-CN.ts`
- docs/scripts/src mojibake scan
- Feature-Sliced boundary scan for `features -> widgets` and `entities -> features/widgets/pages`

Known build warning:

- Vite reports the existing Arco-driven `index` chunk above 500 kB. This is not a functional blocker for this abstraction.
