# API Automation Phase 2 Definition CRUD Smoke

Date: 2026-06-07

## Scope

- Create API definition.
- Edit API definition with detail preload.
- Delete API definition.
- Refresh list after writes.

## Script

`scripts/smoke-api-automation-phase1-3.mjs`

The script verifies:

- `POST /api/automation/api/definitions`
- `GET /api/automation/api/definitions/{id}` detail preload during edit
- `PUT /api/automation/api/definitions/{id}`
- `DELETE /api/automation/api/definitions/{id}`
- created/edited rows appear and deleted rows detach from the page.

## Status

Pass.

Executed command:

```powershell
$env:SMOKE_BASE_URL='http://localhost:5173'; node scripts\smoke-api-automation-phase1-3.mjs
```

Evidence:

- Created `smoke-api-definition-20260606203419` with `POST /api/automation/api/definitions` returning 200.
- Loaded detail with `GET /api/automation/api/definitions/8` returning 200.
- Updated it with `PUT /api/automation/api/definitions/8` returning 200.
- Deleted it with `DELETE /api/automation/api/definitions/8` returning 200.
- Screenshot: `output/playwright/api-automation-phase1-3-20260606203419.png`
