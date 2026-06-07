# API Scenario Wait Controller Smoke

Date: 2026-06-07

## Scope

Phase A1 implements only the API scenario wait controller base capability.

Backend contract:

- `stepType`: `CONSTANT_TIMER`
- field: `delayMs`
- `children`: `[]`

No script, once-only, if, or loop controller behavior is included in this phase.

## Coverage

Smoke script:

```text
npm.cmd run smoke:api-wait
```

Covered behavior:

- Add a wait controller step from the scenario step editor.
- Edit wait step name.
- Edit wait time with a short value, `50ms`.
- Delete an extra wait step.
- Move wait step up/down without drag sorting.
- Save scenario and assert the create payload uses `stepType=CONSTANT_TIMER`.
- Reopen scenario and verify wait step name and `delayMs` are hydrated.
- Update scenario and assert the update payload still uses `stepType=CONSTANT_TIMER`.
- Run scenario and verify the unified run result panel shows an independent wait step result.
- Verify wait result has the configured step name and positive duration.
- Capture screenshot.
- Check horizontal overflow.

## Result

Status: pass

Screenshot:

```text
output/playwright/api-scenario-wait-20260607062646.png
```

Observed backend behavior:

- The backend returns an independent synthetic run step result for `CONSTANT_TIMER`.
- The result contains the wait step name and a positive `durationMs`.
- No HTTP request/response snapshot is expected for the wait step itself.

## Notes

- The smoke intentionally does not assert exact wait duration because runtime duration can vary.
- Initial `/api/auth/me` may return 401 before login; this is expected in the smoke login flow.
