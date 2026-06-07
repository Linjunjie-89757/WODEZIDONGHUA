# API Automation Phase 5 Processors Smoke

Date: 2026-06-07

## Scope

Phase 5 adds processor configuration and processor result display to the existing API definition flow.

Covered:

- pre script processor
- post script processor
- wait processor
- extract processor
- SQL processor with Config Center database connection selection
- processor data structures in `entities/api-automation`
- saved definition create/edit payload preservation
- debug execution processor and extraction result display

Explicitly out of scope:

- API case management
- scenario orchestration
- AI generation
- advanced extraction helper drawer

## Contract Sources

- `docs/api-contract.md`
- `docs/api-automation-migration-analysis.md`
- verified old source summary for `ApiProcessorEditor.vue`
- backend model summary for `ApiProcessorInput`

Old project file reads were blocked by a transient approval service 503 during this run, so this phase uses the already verified migration analysis and prior old-project summary rather than guessing new endpoints. No old frontend or backend files were modified.

## New Frontend Changes

- `src/entities/api-automation/model/types.ts`
  - adds processor config, extractor config, processor result, and extraction result types.
- `src/entities/api-automation/lib/requestConfig.ts`
  - persists definition `preProcessors` and `postProcessors`.
- `src/features/api-definition-processors`
  - adds the processor editor feature.
- `src/features/api-definition-save/ui/ApiDefinitionDialog.vue`
  - composes the processor editor into definition create/edit.
- `src/features/api-definition-debug/ui/ApiDefinitionDebugPanel.vue`
  - displays processor and extraction results in debug output.
- `src/shared/i18n/zh-CN.ts`
  - centralizes all new visible Chinese UI text.

## Smoke Checklist

- Open `/api-automation`.
- Create or edit an API definition.
- Add a pre script processor.
- Add a wait processor.
- Add a post extract processor.
- Add a SQL processor and verify the database connection select is populated from Config Center if available.
- Save the definition.
- Reopen the definition and verify processors are preloaded.
- Run debug execution.
- Open the processor result tab and verify processor/extraction result area renders.
- Capture screenshot.
- Verify no horizontal overflow.

## Verification

Browser smoke script:

```text
scripts/smoke-api-automation-phase5-7.mjs
```

Executed command:

```powershell
$env:SMOKE_BASE_URL='http://localhost:5173'; node scripts\smoke-api-automation-phase5-7.mjs
```

Result:

- Status: pass
- Created definition: `smoke-phase57-definition-20260606234905`
- Screenshot: `output/playwright/api-automation-phase5-7-20260606234905.png`
- Page errors: none
- Horizontal overflow: none
- Cleanup: pass; script deletes smoke scenarios, cases, and definitions in dependency order.
- Console note: one expected pre-login `GET /api/auth/me` 401 appears before successful login.

Successful API evidence:

- `GET /api/settings/db-connections` returned 200 for SQL processor database selection data.
- `POST /api/automation/api/definitions` returned 200 with processor payload.

Completed in final closeout:

- `npm.cmd run lint`
- `npm.cmd run build`
- source Chinese string scan outside `src/shared/i18n/zh-CN.ts`
- docs/scripts mojibake scan
