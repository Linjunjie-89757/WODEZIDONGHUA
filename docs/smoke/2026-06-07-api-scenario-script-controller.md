# API Scenario Script Controller Smoke

Date: 2026-06-07

## Scope

Phase A2 implements only the API scenario script controller base capability.

Backend contract:

- `stepType`: `SCRIPT`
- field: `script`
- `children`: `[]`

No once-only, if, loop, script assertion, or advanced script template behavior is included in this phase.

## Coverage

Smoke script:

```text
npm.cmd run smoke:api-script
```

Covered behavior:

- Add a script controller step from the scenario step editor.
- Edit script step name.
- Edit JavaScript content.
- Move script step up/down without drag sorting.
- Save scenario and assert the create payload uses `stepType=SCRIPT`.
- Assert the persisted payload sends the `script` field and does not persist children.
- Reopen scenario and verify script step name and script content are hydrated.
- Update scenario and assert the update payload still uses `stepType=SCRIPT`.
- Run scenario and verify the unified run result panel shows the script step.
- Verify script execution output appears in processor results.
- Capture screenshot.
- Check horizontal overflow.

## Result

Status: pass

Screenshot:

```text
output/playwright/api-scenario-script-20260607064722.png
```

Observed backend behavior:

- The backend accepts `SCRIPT` steps only when `script` is non-blank.
- The backend returns an independent run step result for the script step.
- Script execution details are exposed through `processorResults`.
- No HTTP request/response snapshot is expected for the script step itself.

## Notes

- The smoke uses `log()` and `setVar()` to verify script execution.
- The smoke intentionally does not cover `fail()` or script assertions; those remain future hardening.
- Initial `/api/auth/me` may return 401 before login; this is expected in the smoke login flow.
