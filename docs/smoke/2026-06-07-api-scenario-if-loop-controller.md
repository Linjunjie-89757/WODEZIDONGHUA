# API Scenario IF and LOOP Controller Smoke

Date: 2026-06-07

## Scope

This smoke record covers API Automation advanced controller Phase A4 and Phase A5 in AutoTestHub frontend 2.0.

Implemented scope:

- Add condition controller entry in the scenario step editor.
- Add loop controller entry in the scenario step editor.
- Persist `IF_CONTROLLER` with expression-mode fields.
- Persist `LOOP_CONTROLLER` with fixed-count loop fields.
- Support name edit, field edit, child custom request, save, hydrate, reopen, run, and result display.
- Verify IF matched and not matched behavior.
- Verify LOOP `loopCount=2` and child execution twice.

Not included:

- IF script-mode condition.
- LOOP while mode.
- LOOP foreach mode.
- Drag sorting.
- AI generation.
- Backend contract changes.
- Page visual redesign.

## Contract

Verified contract source:

- `docs/api-automation-advanced-controllers-contract.md`
- Old backend `ApiAutomationService.executeIfControllerStep`
- Old backend `ApiAutomationService.executeLoopControllerStep`
- Old backend `ApiAutomationService.evaluateScenarioCondition`
- Old backend `ApiAutomationService.resolveScenarioLoopCount`

Persisted IF step contract:

```text
stepType: IF_CONTROLLER
conditionType: EXPRESSION
conditionExpression: string
children: ApiScenarioStepInput[]
```

Runtime IF behavior:

- Backend adds one synthetic controller result.
- `true` runs children.
- `false` skips children.
- Backend synthetic success message is `Condition matched` or `Condition not matched`.

Persisted LOOP step contract:

```text
stepType: LOOP_CONTROLLER
loopType: FIXED
loopCount: number
children: ApiScenarioStepInput[]
```

Runtime LOOP behavior:

- Backend clamps loop count to `0..50`.
- Backend adds one synthetic controller result.
- Backend synthetic success message is `Loop count: N`.
- Children execute once per iteration.

Frontend result note:

- The old backend response model currently returns controller synthetic rows but does not expose a dedicated success `message` field in the serialized response.
- The shared `api-run-result-panel` therefore accepts a future backend `message` field when available and otherwise infers controller display text from the selected scenario steps.

## Smoke

Command:

```powershell
npm.cmd run smoke:api-if-loop
```

Latest result:

```text
status: pass
IF matched scenario: smoke-if-scenario-20260607075437
IF matched step: smoke-if-matched-20260607075437
IF not matched step: smoke-if-not-matched-20260607075437
LOOP scenario: smoke-loop-scenario-20260607075437
LOOP step: smoke-loop-step-20260607075437
LOOP child: smoke-loop-child-20260607075437
```

Screenshot:

```text
output/playwright/api-scenario-if-loop-20260607075437.png
```

Covered checks:

- Login and API Automation page load.
- Cleanup of stale `smoke-if-scenario-*` and `smoke-loop-scenario-*` test data.
- IF controller add button exists.
- Save payload uses backend step type `IF_CONTROLLER`.
- Save payload uses `conditionType: EXPRESSION`.
- Save payload persists `conditionExpression: true`.
- IF controller persists one custom request child.
- Edit dialog hydrates IF condition expression.
- IF matched run displays `Condition matched`.
- IF matched child executes.
- API-created IF not matched scenario displays controller result in backend response.
- IF not matched child does not execute.
- LOOP controller add button exists.
- Save payload uses backend step type `LOOP_CONTROLLER`.
- Save payload uses `loopType: FIXED`.
- Save payload persists `loopCount: 2`.
- LOOP controller persists one custom request child.
- Edit dialog hydrates LOOP count.
- LOOP run displays `Loop count: 2`.
- LOOP child appears twice in raw run response.
- Screenshot is captured.
- Page has no horizontal overflow.
- Created smoke scenarios are deleted by API cleanup.

## Risks

- IF script mode, LOOP while mode, and LOOP foreach mode are backend-supported but intentionally outside this phase.
- The backend success message field is not exposed in the current run response contract, so controller success text is inferred by the frontend result panel until the backend exposes `message`.
- The smoke covers custom request children. Referenced API and referenced case child controls were already covered in scenario step editor smoke and are available through the same recursive editor surface.
