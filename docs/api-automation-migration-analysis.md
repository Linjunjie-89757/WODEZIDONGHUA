# API Automation Migration Analysis

Date: 2026-06-07

## Scope

This document is the API Automation pre-implementation artifact for AutoTestHub frontend 2.0. It records the verified old-project sources, backend API contract, old frontend structure, and the recommended Feature-Sliced Lite decomposition.

This phase is read-only against the old frontend and backend. It does not implement the new API Automation page.

## Verified Sources

Old frontend:

- `D:\CodeProject\auto\web\src\api\platform.ts`
- `D:\CodeProject\auto\web\src\types\api.ts`
- `D:\CodeProject\auto\web\src\views\AutomationView.vue`
- `D:\CodeProject\auto\web\src\components\ApiAutomationWorkspace.vue`
- `D:\CodeProject\auto\web\src\components\ApiAssertionEditor.vue`
- `D:\CodeProject\auto\web\src\components\ApiProcessorEditor.vue`
- `D:\CodeProject\auto\web\src\components\ApiFastExtractionDrawer.vue`
- `D:\CodeProject\auto\web\src\components\ApiCaseDrawer.vue`

Backend:

- `D:\CodeProject\auto\server\src\main\java\com\company\autoplatform\apiautomation\ApiAutomationController.java`
- `D:\CodeProject\auto\server\src\main\java\com\company\autoplatform\apiautomation\ApiAutomationModels.java`
- `D:\CodeProject\auto\server\src\main\java\com\company\autoplatform\apiautomation\ApiAutomationService.java`
- `D:\CodeProject\auto\server\src\main\java\com\company\autoplatform\apiautomation\ApiAiCaseGenerationService.java`
- `D:\CodeProject\auto\server\src\main\resources\db\migration-mysql\V23__add_api_automation_tables.sql`
- `D:\CodeProject\auto\server\src\main\resources\db\migration-mysql\V24__add_api_definition_cases.sql`
- `D:\CodeProject\auto\server\src\main\resources\db\migration-mysql\V25__add_api_case_run_history.sql`
- `D:\CodeProject\auto\server\src\main\resources\db\migration-mysql\V26__add_api_case_change_history.sql`
- `D:\CodeProject\auto\server\src\main\resources\db\migration-mysql\V33__add_api_scenario_modules.sql`
- `D:\CodeProject\auto\server\src\main\resources\db\migration-mysql\V39__add_api_definition_modules.sql`

New frontend references:

- `D:\CodeProject\AutoTestHub\docs\api-contract.md`
- `D:\CodeProject\AutoTestHub\docs\module-migration-playbook.md`
- `D:\CodeProject\AutoTestHub\src\pages\api-automation\ui\ApiAutomationPage.vue`

## Contract Summary

Backend base path:

```text
/api/automation/api
```

New frontend endpoint constants should omit the leading `/api` because `VITE_API_BASE_URL` already points to `http://localhost:8080/api`.

The full verified contract is recorded in `docs/api-contract.md` under `### API Automation`.

Main contract groups:

- API definitions: list, detail, create, update, delete, saved debug run, draft debug run.
- Definition modules: list, create, update, move, delete.
- API cases: list, detail, create, update, delete, run, draft debug run.
- Case history: run history list, run history detail, change history list.
- AI case generation: SSE stream for generated API cases.
- API scenarios: list, detail, create, update, delete, run.
- Scenario modules: list, create, update, move, delete.
- API environments: list, create, update, delete.
- API variable sets: list, create, update, delete.
- Run reports: list report step results.

Important mismatch:

- Backend exposes definition-module and scenario-module move endpoints.
- Old `web/src/api/platform.ts` does not wrap those move endpoints.
- New frontend should include the endpoints because `ApiAutomationController.java` proves the contract.

## Old Frontend Structure

The old API Automation UI is centered in `ApiAutomationWorkspace.vue`. It is very large and combines responsibilities that should be separated in frontend 2.0:

- Definition tree, definition list, and selected definition state.
- Definition module tree creation, rename, deletion, and selection.
- Request editor tabs for definition, case, and AI-generated case drafts.
- HTTP request editing: method, path, query params, headers, cookies, auth, body, timeout.
- Request body editing for raw text, form items, JSON, XML, plain text, and binary metadata.
- Assertion editor orchestration.
- Processor editor orchestration for pre and post processors.
- Debug execution and response preview.
- API case list, case drawer, run history, change history, and debug state.
- Scenario list, scenario module tree, scenario editor tabs, step tree, nested steps, imports, custom request drawer, script drawer, assertions, and run state.
- Environment and variable set selection and CRUD.
- Database connection selection for SQL processors.
- AI case generation drawer, SSE handling, generated draft review, debug, accept, and discard.
- Report preview and bug creation from failed report.

Reusable old components:

- `ApiAssertionEditor.vue` defines assertion types and local normalization for response code, response header, response body, response time, variable, and script assertions.
- `ApiProcessorEditor.vue` defines script, SQL, wait, and extract processors. It uses database connections for SQL processors and latest response data for extraction helpers.
- `ApiFastExtractionDrawer.vue` provides JSONPath, XPath, and regex exploration/test helpers from a response body.
- `ApiCaseDrawer.vue` wraps case detail, debug, run history, and change history presentation.

The old implementation is useful as behavior reference, but not as a page-level structure reference. Rebuilding by copying this component would recreate the same large-file failure mode.

## Backend Domain Shape

Core records from `ApiAutomationModels.java`:

- `ApiRequestConfigInput`: method, path, timeout, query params, headers, cookies, body, auth.
- `ApiRequestBodyInput`: type, raw text, form items, content type, file name, binary base64.
- `ApiAssertionInput`: response code/header/body/time, variable, and script assertion fields.
- `ApiProcessorInput`: script, SQL, wait, and extract processor fields.
- `SaveApiDefinitionRequest`: definition metadata plus request config, assertions, extractors, pre processors, post processors.
- `SaveApiDefinitionCaseRequest`: case metadata plus request config, assertions, pre processors, post processors.
- `SaveApiScenarioRequest`: scenario metadata plus environment, variable set, variables, scenario assertions, and nested steps.
- `ApiRunRequest`: selected environment and variable set for run/debug.
- `ApiDebugDefinitionRequest` and `ApiDebugCaseRequest`: draft request config and run context.
- `ApiRunResponse`, `ApiRunStepResultResponse`, request/response snapshots, assertion results, extraction results, and processor results.

Backend service responsibilities imply these frontend subdomains:

- Request construction and normalization.
- Environment and variable resolution.
- Processor execution configuration.
- Assertion configuration and result display.
- Definition/case/scenario persistence.
- Execution and report inspection.
- AI generation and generated draft review.

## New Frontend Module Decomposition

Recommended entity:

```text
src/entities/api-automation
  api/apiAutomationApi.ts
  model/types.ts
  lib/requestConfig.ts
  lib/assertionConfig.ts
  lib/processorConfig.ts
  lib/scenarioStep.ts
  lib/runResult.ts
  index.ts
```

Entity responsibilities:

- Own TypeScript models that mirror verified backend records.
- Own endpoint calls for definitions, modules, cases, scenarios, environments, variable sets, runs, report steps, and AI generation stream.
- Own payload builders and normalizers that are not UI-specific.
- Reuse `entities/config-center` only where the backend contract is actually shared. Do not pretend `/automation/api/environments` is the same as `/settings/envs`.

Recommended widgets:

```text
src/widgets/api-automation-shell
src/widgets/api-definition-browser
src/widgets/api-request-workbench
src/widgets/api-case-browser
src/widgets/api-scenario-browser
src/widgets/api-scenario-workbench
src/widgets/api-run-result-panel
src/widgets/api-automation-settings
```

Widget responsibilities:

- `api-automation-shell`: top-level tabs, workspace-scoped load orchestration, selected environment and variable set.
- `api-definition-browser`: definition module tree and definition list.
- `api-request-workbench`: request editor, assertion editor slot, processor editor slot, debug result.
- `api-case-browser`: case list, case detail drawer, run history, change history.
- `api-scenario-browser`: scenario module tree and scenario list.
- `api-scenario-workbench`: scenario editor, nested steps, step drawers, scenario assertions.
- `api-run-result-panel`: request snapshot, response snapshot, assertion/extraction/processor results.
- `api-automation-settings`: API-specific environments and variable sets.

Recommended features:

```text
src/features/api-definition-create
src/features/api-definition-edit
src/features/api-definition-delete
src/features/api-definition-module-create
src/features/api-definition-module-edit
src/features/api-definition-module-move
src/features/api-definition-module-delete
src/features/api-request-debug
src/features/api-case-create
src/features/api-case-edit
src/features/api-case-delete
src/features/api-case-run
src/features/api-case-history-view
src/features/api-ai-case-generate
src/features/api-assertion-config
src/features/api-processor-config
src/features/api-fast-extraction
src/features/api-scenario-create
src/features/api-scenario-edit
src/features/api-scenario-delete
src/features/api-scenario-run
src/features/api-scenario-module-create
src/features/api-scenario-module-edit
src/features/api-scenario-module-move
src/features/api-scenario-module-delete
src/features/api-scenario-step-edit
src/features/api-environment-create
src/features/api-environment-edit
src/features/api-environment-delete
src/features/api-variable-set-create
src/features/api-variable-set-edit
src/features/api-variable-set-delete
```

Recommended shared UI reuse:

- `AppPage`
- `AppSection`
- `AppCard`
- `AppToolbar`
- `AppTable`
- `AppDialog`
- `AppDrawer`
- `AppStatusBadge`
- `feedback` from `shared/lib/feedback`

Chinese UI text rule:

- New visible Chinese text belongs in `src/shared/i18n/zh-CN.ts`.
- Entity constants can expose stable enum values, but display labels should come from i18n or a localized label map imported from i18n.

## Migration Phases

Phase 1: API Automation readonly shell

- Add `entities/api-automation` types and API methods for definitions, definition modules, environments, and variable sets.
- Build shell, definition browser, and settings summary.
- Smoke: login, open `/api-automation`, load definition/module lists, load environment/variable-set lists, no horizontal overflow.

Phase 2: Request editor and definition CRUD

- Add create/edit/delete definition.
- Add request config editor for method, path, query, headers, cookies, auth, body, timeout.
- Smoke: create draft, save, reopen detail, update, delete.

Phase 3: Debug execution and run result panel

- Add saved definition debug and draft definition debug.
- Add environment and variable-set selection in run context.
- Add request/response snapshot, assertion result, extraction result, processor result display.
- Smoke: debug a simple GET request and validate result panel renders.

Phase 4: Assertion configuration

- Implement response code, response header, response body, response time, variable, and script assertion configs.
- Use backend-compatible `ApiAssertionInput`.
- Smoke: configure assertion types, debug draft, verify assertion result rows.

Phase 5: Processor configuration

- Implement pre/post script, SQL, wait, and extract processors.
- Reuse config-center database connection entity for SQL processor selection if the backend expects `dataSourceId`.
- Smoke: configure wait/extract processor and verify processor result display.

Phase 6: API case management

- Add case list/detail, create/edit/delete, run, draft debug.
- Add run history and change history.
- Smoke: create case from definition, run case, inspect history.

Phase 7: AI generated API cases

- Add SSE stream wrapper and generated draft review.
- Reuse existing `processes/ai-generation-flow` where applicable.
- Smoke: stream event handling can be tested with controlled backend or mocked stream if backend AI provider is unavailable.

Phase 8: Scenario management

- Add scenario list/detail/create/edit/delete/run.
- Add scenario modules and move support.
- Add nested step editor for API, API case, custom request, scenario reference, if, loop, once-only, wait, and script steps.
- Smoke: create simple scenario with one custom request, run, inspect results.

Phase 9: Closeout

- Visual smoke across desktop and mobile.
- Lint, build, encoding scan.
- Verify module boundaries.
- Add closeout record under `docs/smoke`.

## Do Not Do In Early Phases

- Do not copy `ApiAutomationWorkspace.vue` into the new frontend.
- Do not combine definition, case, scenario, AI generation, settings, and reports into one widget.
- Do not guess endpoint paths; update `docs/api-contract.md` first when a new call is needed.
- Do not use Config Center endpoints as substitutes for `/automation/api/environments` or `/automation/api/variable-sets`.
- Do not put Arco `Message` or modal APIs directly in business code; use `shared/lib/feedback`.
- Do not scatter Chinese strings in feature/widget/page files.

## Phase 0 Acceptance

- `docs/api-contract.md` contains verified API Automation rows.
- This document records old source files, backend domain shape, old structure analysis, and new module decomposition.
- At Phase 0 time, `src/pages/api-automation/ui/ApiAutomationPage.vue` remained a placeholder.
- No old frontend or backend files are modified.
- No new API Automation page implementation was added in Phase 0.
