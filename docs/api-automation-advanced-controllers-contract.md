# API Automation Advanced Controllers Contract

Date: 2026-06-07

## Scope

This document records the verified contract for API Automation advanced scenario controllers in the old project. It is a read-only analysis artifact for AutoTestHub frontend 2.0.

No page implementation is included in this phase.

## Sources Read

Old frontend:

- `D:\CodeProject\auto\web\src\types\api.ts`
- `D:\CodeProject\auto\web\src\components\ApiAutomationWorkspace.vue`

Old backend:

- `D:\CodeProject\auto\server\src\main\java\com\company\autoplatform\apiautomation\ApiAutomationController.java`
- `D:\CodeProject\auto\server\src\main\java\com\company\autoplatform\apiautomation\ApiAutomationModels.java`
- `D:\CodeProject\auto\server\src\main\java\com\company\autoplatform\apiautomation\ApiAutomationService.java`
- `D:\CodeProject\auto\server\src\main\java\com\company\autoplatform\apiautomation\ApiAutomationScriptRunner.java`

New frontend references checked:

- `D:\CodeProject\AutoTestHub\src\shared\api\endpoints.ts`
- `D:\CodeProject\AutoTestHub\src\entities\api-automation\model\types.ts`
- `D:\CodeProject\AutoTestHub\src\entities\api-automation\lib\scenarioConfig.ts`

## Endpoint Contract

Advanced controllers do not require new endpoints. They are stored and executed through the existing scenario contract.

Base controller path in the old backend:

```text
/api/automation/api
```

New frontend endpoint constants should continue omitting the leading `/api`, because `VITE_API_BASE_URL` points to `http://localhost:8080/api`.

Relevant endpoints:

```text
GET    /automation/api/scenarios/{id}
POST   /automation/api/scenarios
PUT    /automation/api/scenarios/{id}
POST   /automation/api/scenarios/{id}/run
GET    /automation/api/runs/reports/{reportId}/steps
```

## Supported Step Types

The backend allow-list is fixed in `ApiAutomationService.normalizeScenarioStepType`.

Supported persisted `stepType` values:

```text
API
API_CASE
CUSTOM_REQUEST
API_SCENARIO
IF_CONTROLLER
LOOP_CONTROLLER
ONCE_ONLY_CONTROLLER
CONSTANT_TIMER
SCRIPT
```

Important caution:

- `GROUP` is not a backend-supported step type.
- The new frontend currently has a UI group concept in `src/entities/api-automation/lib/scenarioConfig.ts`, but it must not be persisted as `stepType: "GROUP"`.
- If a visual group is needed later, keep it as frontend-only metadata or normalize it to a backend-supported type before save. Do not invent new backend step types from the frontend.

## Step Input Shape

Backend `ApiScenarioStepInput` fields:

```ts
{
  id?: string
  stepName: string
  stepType: string
  resourceType?: string | null
  resourceId?: number | null
  enabled?: boolean
  requestConfig?: ApiRequestConfigInput | null
  assertions?: ApiAssertionInput[]
  preProcessors?: ApiProcessorInput[]
  postProcessors?: ApiProcessorInput[]
  delayMs?: number | null
  conditionType?: string | null
  conditionExpression?: string | null
  loopType?: string | null
  loopCount?: number | null
  foreachExpression?: string | null
  script?: string | null
  children?: ApiScenarioStepInput[]
}
```

Frontend 2.0 currently uses `name` on `ApiScenarioStep`. Before advanced controllers are implemented, scenario save normalization must ensure backend-compatible `stepName` is sent, while still accepting old/new detail hydration safely.

## Global Backend Limits

Verified constants in `ApiAutomationService`:

```text
MAX_SCENARIO_NESTING_DEPTH = 3
MAX_SCENARIO_LOOP_COUNT = 50
MAX_SCENARIO_WAIT_MS = 60000
```

Normalization rules:

- `enabled` defaults to true unless explicitly false.
- `delayMs` defaults to 1000 and is clamped to 1-60000.
- `loopCount` defaults to 1 and is clamped to 0-50.
- `loopType` supports `FIXED`, `WHILE`, `FOREACH`; anything else normalizes to `FIXED`.
- `conditionType` defaults to `EXPRESSION`.
- `SCRIPT` steps cannot save with blank `script`.
- `CONSTANT_TIMER` and `SCRIPT` force `children` to an empty list.

## Per Controller Contract

### IF_CONTROLLER

Purpose:

- Runs child steps only when a condition matches.

Fields:

- `stepType`: `IF_CONTROLLER`
- `conditionType`: `EXPRESSION` or `SCRIPT`
- `conditionExpression`: expression text or JavaScript snippet
- `children`: child scenario steps

Runtime behavior:

- Adds one synthetic step result for the controller itself.
- Synthetic result is success with message `Condition matched` or `Condition not matched`.
- If matched, runs `children`.
- If not matched, skips `children`.
- No request or response snapshot is attached to the controller result.

Expression behavior:

- Variables are resolved through `{{name}}`.
- Literal `true` and `false` are supported.
- Comparison pattern supports `==`, `=`, `!=`, `<>`, `>=`, `<=`, `>`, `<`, and `contains`.

Script behavior:

- Runs through `ApiAutomationScriptRunner`.
- Script success means condition matched.
- Script can mutate variables through the script runner.

### LOOP_CONTROLLER

Purpose:

- Repeats child steps.

Fields:

- `stepType`: `LOOP_CONTROLLER`
- `loopType`: `FIXED`, `WHILE`, or `FOREACH`
- `loopCount`: used for `FIXED`
- `conditionExpression`: used for `WHILE`
- `conditionType`: used by condition evaluation, default `EXPRESSION`
- `foreachExpression`: used for `FOREACH`
- `delayMs`: normalized but not currently used as a sleep interval in loop execution
- `children`: child scenario steps

Runtime behavior:

- Adds one synthetic controller result with message `Loop count: N`.
- For each iteration, executes `children`.
- Sets variable `loopIndex` to the zero-based iteration index.
- For `FOREACH`, splits `foreachExpression` by comma or newline after variable replacement, limits to 50 items, and sets variable `item`.
- For `WHILE`, initial condition false means 0 iterations. If initially true, loop may run up to 50 iterations. From the second iteration onward, it re-evaluates condition before running children.
- If `continueOnFailure` is false, a failed child result stops the loop.

### ONCE_ONLY_CONTROLLER

Purpose:

- Runs child steps only once per scenario run.

Fields:

- `stepType`: `ONCE_ONLY_CONTROLLER`
- `children`: child scenario steps

Runtime behavior:

- Uses `step.id` as the once-only key. If id is blank, uses `stepName`, then a generated fallback.
- Adds one synthetic controller result.
- First encounter message is `Executed`, and child steps run.
- Later encounters with the same key in the same scenario execution return message `Skipped`, and children do not run.

Implementation caution:

- Stable `id` matters. Re-generating ids on every edit can change once-only behavior.

### CONSTANT_TIMER

Purpose:

- Waits for a fixed duration.

Fields:

- `stepType`: `CONSTANT_TIMER`
- `delayMs`: wait duration in milliseconds

Runtime behavior:

- `delayMs` defaults to 1000 and is clamped to 1-60000.
- Backend sleeps for the resolved duration.
- Adds one synthetic step result with message `Waited X ms`.
- Does not allow children after normalization.

### SCRIPT

Purpose:

- Runs JavaScript as a scenario step.

Fields:

- `stepType`: `SCRIPT`
- `script`: JavaScript content, required and non-blank
- `assertions`: only variable and script assertions are evaluated for script steps

Runtime behavior:

- Runs through `ApiAutomationScriptRunner`.
- Requires Node.js on the backend host.
- Timeout is 10 seconds.
- Provides helper functions: `setVar`, `getVar`, `removeVar`, `log`, and `fail`.
- Blocks `require`, `process`, `global`, and `module` inside the script bridge.
- Mutates scenario variables from script output.
- Adds one run step result with `processorResults` containing the script execution result.
- If script succeeds, evaluates `VARIABLE` and `SCRIPT` assertions only.
- Does not attach request or response snapshots.
- Does not allow children after normalization.

### API_SCENARIO

Although not part of the requested advanced-controller UI list, old frontend and backend already support referenced scenarios.

Fields:

- `stepType`: `API_SCENARIO`
- `resourceId`: referenced scenario id

Runtime behavior:

- Adds one synthetic result for the referenced scenario step.
- Executes the referenced scenario's stored steps.
- Rejects circular reference to the root scenario.
- Rejects inaccessible or cross-workspace scenarios.
- Stops when nesting depth reaches 3.

## Old Frontend UI Behavior

Old frontend add-step actions:

```text
IMPORT_SYSTEM_API
CUSTOM_REQUEST
LOOP_CONTROLLER
IF_CONTROLLER
ONCE_ONLY_CONTROLLER
SCRIPT
CONSTANT_TIMER
```

Old frontend labels:

```text
API                  Interface
API_CASE             API case
CUSTOM_REQUEST       Custom request
API_SCENARIO         Referenced scenario
IF_CONTROLLER        If controller
LOOP_CONTROLLER      Loop controller
ONCE_ONLY_CONTROLLER Once-only controller
CONSTANT_TIMER       Fixed wait
SCRIPT               Script
```

Old frontend default step values:

- `CONSTANT_TIMER.delayMs`: 1000
- `LOOP_CONTROLLER.delayMs`: 0 in UI, but backend normalizes null or zero through scenario normalization and execution clamps wait steps separately
- `LOOP_CONTROLLER.loopType`: `FIXED`
- `LOOP_CONTROLLER.loopCount`: 1
- `IF_CONTROLLER.conditionType`: `EXPRESSION`
- `SCRIPT.script`: empty in UI, but backend rejects blank script on save
- Controllers with child steps: `IF_CONTROLLER`, `LOOP_CONTROLLER`, `ONCE_ONLY_CONTROLLER`
- Non-child advanced steps: `CONSTANT_TIMER`, `SCRIPT`

## Run Result Display Implications

Advanced controllers mostly produce synthetic step results:

- Controller results can have `request = null` and `response = null`.
- UI must not assume every result has HTTP status, URL, headers, or body.
- `IF_CONTROLLER`, `LOOP_CONTROLLER`, `ONCE_ONLY_CONTROLLER`, `CONSTANT_TIMER`, `API_SCENARIO`, and `SCRIPT` all need readable result summary rows.
- `SCRIPT` exposes useful details through `processorResults`, not through HTTP response.
- Child steps continue using normal `ApiRunStepResultResponse` structures.

The existing `api-run-result-panel` should therefore support:

- HTTP request/response result rows.
- Synthetic controller result rows.
- Processor-only script result rows.
- Nested execution display through flat `stepOrder` initially; tree visualization can be a later enhancement.

## Implementation Recommendation

Recommended order:

1. Contract hardening before UI: update entity types and save normalization so `GROUP` is not persisted, and `stepName` is sent to the backend.
2. `CONSTANT_TIMER`: smallest UI and simplest smoke coverage.
3. `SCRIPT`: validates script runner, processor result rendering, and script assertions.
4. `ONCE_ONLY_CONTROLLER`: depends on stable step ids and child-step editor.
5. `IF_CONTROLLER`: expression first, script condition second.
6. `LOOP_CONTROLLER`: fixed count first, then foreach, then while.
7. `API_SCENARIO`: only if referenced-scenario UX is needed in the same phase.

Do not implement condition branches, break/continue, parallel execution, controller-level assertions, or custom backend controller types unless the old backend contract is extended first.

## Smoke Coverage Needed Later

When implementation starts, smoke should cover:

- Save and reload each advanced step type.
- Run scenario and verify controller synthetic result rows.
- `CONSTANT_TIMER` wait result with clamped duration.
- `SCRIPT` success, variable mutation, log output, and failure through `fail()`.
- `ONCE_ONLY_CONTROLLER` skip behavior with duplicate stable id.
- `IF_CONTROLLER` matched and unmatched branches.
- `LOOP_CONTROLLER` fixed count, foreach item variable, while stop condition.
- Scenario with request/response child steps under controllers.
- Screenshot and horizontal overflow check.

## Open Risks

- Current new frontend type includes `GROUP`, but backend rejects it. This is the main blocker to address before implementing advanced controllers.
- Current new frontend step model uses `name`; backend and old frontend use `stepName`. Save and hydrate normalization must be explicit.
- Script execution depends on Node.js availability in the backend runtime.
- Loop `delayMs` appears in the old UI but is not used as a per-iteration sleep in the backend execution path. Do not promise loop interval behavior without backend changes.
