# API Automation Phase 1-3 Smoke

Date: 2026-06-07

## Scope

Goal phases covered:

- Phase 1 readonly shell: API definitions, definition modules, environments, variable sets, and base layout.
- Phase 2 definition CRUD: create, detail preload/edit, delete, and list refresh.
- Phase 3 basic debug execution: selected environment/variable set, send saved definition debug request, response status/headers/body/duration display.

Explicitly out of scope:

- API cases.
- API scenarios.
- Assertions.
- Processors.
- AI generation.

## Contract Sources

- Contract table: `docs/api-contract.md`
- Migration analysis: `docs/api-automation-migration-analysis.md`
- Old frontend API calls: `D:\CodeProject\auto\web\src\api\platform.ts`
- Backend controller: `D:\CodeProject\auto\server\src\main\java\com\company\autoplatform\apiautomation\ApiAutomationController.java`
- Backend DTOs: `D:\CodeProject\auto\server\src\main\java\com\company\autoplatform\apiautomation\ApiAutomationModels.java`

## Smoke Script

Script:

```text
scripts/smoke-api-automation-phase1-3.mjs
```

Expected command:

```powershell
$env:SMOKE_BASE_URL='http://localhost:5173'; node scripts\smoke-api-automation-phase1-3.mjs
```

The script verifies:

- Login and navigation to `/api-automation`.
- `GET /api/automation/api/definitions`.
- `GET /api/automation/api/definition-modules`.
- `GET /api/automation/api/environments`.
- `GET /api/automation/api/variable-sets`.
- Create definition through `POST /api/automation/api/definitions`.
- Edit form preloads detail from `GET /api/automation/api/definitions/{id}`.
- Update definition through `PUT /api/automation/api/definitions/{id}`.
- Debug saved definition through `POST /api/automation/api/definitions/{id}/debug-run`.
- Delete definition through `DELETE /api/automation/api/definitions/{id}`.
- No horizontal overflow.

## Execution Notes

The first RED run against `http://localhost:5173` failed as expected because the page was still a placeholder and did not expose `data-testid="api-automation-shell"`.

During verification, `/api-automation` on port `5173` was found to be proxied to the backend and returned:

```json
{"success":false,"data":null,"message":"Please log in first"}
```

Root cause: Vite proxy key `'/api'` also matched the frontend route `/api-automation`. The proxy rule was corrected to `'^/api(?:/|$)'`.

Final browser smoke pass:

```powershell
$env:SMOKE_BASE_URL='http://localhost:5173'; node scripts\smoke-api-automation-phase1-3.mjs
```

Result:

- Status: pass
- Created definition: `smoke-api-definition-20260606203419`
- Edited definition: `smoke-api-definition-20260606203419-edited`
- Screenshot: `output/playwright/api-automation-phase1-3-20260606203419.png`
- Page errors: none
- Console note: one expected pre-login `GET /api/auth/me` 401 appears before successful login.

Successful API evidence:

- `POST /api/auth/login` returned 200.
- `GET /api/workspaces/switchable` returned 200.
- `GET /api/automation/api/definitions` returned 200.
- `GET /api/automation/api/definition-modules` returned 200.
- `GET /api/automation/api/environments` returned 200.
- `GET /api/automation/api/variable-sets` returned 200.
- `POST /api/automation/api/definitions` returned 200.
- `GET /api/automation/api/definitions/8` returned 200.
- `PUT /api/automation/api/definitions/8` returned 200.
- `POST /api/automation/api/definitions/8/debug-run` returned 200.
- `DELETE /api/automation/api/definitions/8` returned 200.

## Verification

Completed:

- `npm.cmd run lint`
- `npm.cmd run build`
- docs mojibake scan
- src Chinese string scan outside `src/shared/i18n/zh-CN.ts`
- scripts mojibake scan

Known build warning:

- Vite reports the existing Arco-driven `index` chunk above 500 kB. This is already known and is not a functional blocker for this phase.
