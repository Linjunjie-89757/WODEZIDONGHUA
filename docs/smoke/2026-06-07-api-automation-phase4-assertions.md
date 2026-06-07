# API Automation Phase 4 Assertions Smoke

Date: 2026-06-07

## Scope

- Phase 0-3 closeout evidence remains reusable: API contract, entity API, widgets, features, smoke records, and screenshot artifacts.
- Phase 4 assertion configuration:
  - status code assertion
  - response header assertion
  - response body assertion
  - response time assertion
  - saved definition detail preload
  - debug execution
  - assertion result display
  - screenshot and horizontal overflow check

Explicitly out of scope:

- processors
- API case management
- scenario orchestration
- AI generation

## Contract Sources

- `docs/api-contract.md`
- `docs/api-automation-migration-analysis.md`
- Old frontend assertion editor: `D:\CodeProject\auto\web\src\components\ApiAssertionEditor.vue`
- Old frontend type contract: `D:\CodeProject\auto\web\src\types\api.ts`
- Backend model: `D:\CodeProject\auto\server\src\main\java\com\company\autoplatform\apiautomation\ApiAutomationModels.java`
- Backend assertion evaluation: `D:\CodeProject\auto\server\src\main\java\com\company\autoplatform\apiautomation\ApiAutomationService.java`

## Smoke Script

Script:

```text
scripts/smoke-api-automation-phase1-3.mjs
```

Executed command:

```powershell
$env:SMOKE_BASE_URL='http://localhost:5173'; node scripts\smoke-api-automation-phase1-3.mjs
```

Result:

- Status: pass
- Created definition: `smoke-api-definition-20260606205051`
- Edited definition: `smoke-api-definition-20260606205051-edited`
- Screenshot: `output/playwright/api-automation-phase1-4-20260606205051.png`
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
- `GET /api/automation/api/definitions/11` returned 200 and preloaded the four assertion configs.
- `PUT /api/automation/api/definitions/11` returned 200.
- `POST /api/automation/api/definitions/11/debug-run` returned 200 and rendered assertion results.
- `DELETE /api/automation/api/definitions/11` returned 200.

## Verification

Completed:

- `npm.cmd run lint`
- browser smoke command above

Final closeout still also runs:

- `npm.cmd run build`
- docs mojibake scan
- scripts mojibake scan
- src Chinese string scan outside `src/shared/i18n/zh-CN.ts`

Known build warning:

- Vite reports the existing Arco-driven `index` chunk above 500 kB. This is not a functional blocker for Phase 4.
