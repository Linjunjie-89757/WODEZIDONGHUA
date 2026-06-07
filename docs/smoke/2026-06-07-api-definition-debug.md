# API Automation Phase 3 Definition Debug Smoke

Date: 2026-06-07

## Scope

- Minimal request configuration: method, path, query, headers, raw body, timeout.
- Environment and variable-set selection.
- Saved definition debug execution.
- Response status, headers, body, duration display.

## Script

`scripts/smoke-api-automation-phase1-3.mjs`

The script verifies:

- `POST /api/automation/api/definitions/{id}/debug-run`
- `data-testid="api-debug-send"`
- `data-testid="api-debug-status"`
- `data-testid="api-debug-response-body"`
- no horizontal overflow.

## Status

Pass.

Executed command:

```powershell
$env:SMOKE_BASE_URL='http://localhost:5173'; node scripts\smoke-api-automation-phase1-3.mjs
```

Evidence:

- Sent saved definition debug request with `POST /api/automation/api/definitions/8/debug-run` returning 200.
- Verified `data-testid="api-debug-status"`.
- Verified `data-testid="api-debug-response-body"`.
- Verified no horizontal overflow.
- Screenshot: `output/playwright/api-automation-phase1-3-20260606203419.png`
