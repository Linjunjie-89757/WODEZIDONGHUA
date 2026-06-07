# API Automation Phase 4 Assertions

Date: 2026-06-07

## Goal

Phase 4 adds the first assertion configuration capability to the AutoTestHub frontend 2.0 API Automation module. It builds on the completed Phase 0-3 definition CRUD and debug execution flow, and stops before processors, API cases, scenarios, and AI generation.

## Verified Old Sources

- `D:\CodeProject\auto\web\src\components\ApiAssertionEditor.vue`
- `D:\CodeProject\auto\web\src\types\api.ts`
- `D:\CodeProject\auto\server\src\main\java\com\company\autoplatform\apiautomation\ApiAutomationModels.java`
- `D:\CodeProject\auto\server\src\main\java\com\company\autoplatform\apiautomation\ApiAutomationService.java`

## Contract

No new backend endpoint is required.

- Save assertions through existing `SaveApiDefinitionRequest.assertions`.
- Read assertions through existing `ApiDefinitionDetail.assertions`.
- Execute assertions through existing `POST /api/automation/api/definitions/{id}/debug-run`.
- Display assertion results from existing `ApiRunStepResultResponse.assertionResults`.

Supported in this phase:

- `RESPONSE_CODE`
- `RESPONSE_HEADER`
- `RESPONSE_BODY`
- `RESPONSE_TIME`

Not implemented in this phase:

- `VARIABLE`
- `SCRIPT`
- processors
- API cases
- scenarios
- AI generation

## New Frontend Decomposition

- `src/entities/api-automation/model/types.ts`
  - owns assertion config/result types.
- `src/entities/api-automation/lib/requestConfig.ts`
  - persists supported assertion configs in definition save payloads.
- `src/features/api-definition-assertions`
  - owns assertion option metadata and assertion editor UI.
- `src/features/api-definition-save/ui/ApiDefinitionDialog.vue`
  - composes the assertion editor into definition create/edit.
- `src/features/api-definition-debug/ui/ApiDefinitionDebugPanel.vue`
  - displays backend assertion results after debug execution.

## Acceptance

- Phase 0-3 closeout evidence is preserved in existing smoke records and screenshots.
- Four assertion types can be configured in the definition dialog.
- Saved definitions preload assertion configs in edit mode.
- Debug execution renders assertion result rows from backend response.
- No processor, API case, scenario, or AI generation implementation is added.
- Chinese UI text remains centralized in `src/shared/i18n/zh-CN.ts`.
