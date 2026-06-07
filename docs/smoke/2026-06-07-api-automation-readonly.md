# API Automation Phase 1 Readonly Smoke

Date: 2026-06-07

## Scope

- Base `/api-automation` layout.
- Definition list.
- Definition modules.
- API environments.
- API variable sets.

## Script

`scripts/smoke-api-automation-phase1-3.mjs`

The script includes Phase 1 checks before CRUD/debug steps:

- `data-testid="api-automation-shell"`
- `data-testid="api-definition-list"`
- `data-testid="api-definition-modules"`
- `data-testid="api-environment-select"`
- `data-testid="api-variable-set-select"`
- successful readonly requests for definitions, definition modules, environments, and variable sets.

## Status

Pass.

Executed command:

```powershell
$env:SMOKE_BASE_URL='http://localhost:5173'; node scripts\smoke-api-automation-phase1-3.mjs
```

Evidence:

- `GET /api/automation/api/definitions` returned 200.
- `GET /api/automation/api/definition-modules` returned 200.
- `GET /api/automation/api/environments` returned 200.
- `GET /api/automation/api/variable-sets` returned 200.
- Screenshot: `output/playwright/api-automation-phase1-3-20260606203419.png`
