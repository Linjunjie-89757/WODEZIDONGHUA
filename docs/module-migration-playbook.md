# Frontend 2.0 Module Migration Playbook

This playbook is the migration standard proven by the Config Center, Case Center, and Bug Management sample modules.

Use it for every later module, especially AI generation, defect source flows, and API automation.

## Core Rule

Do not copy the old frontend structure. Use the old project as a business and API reference only.

Every migrated module must prove:

- verified API contract;
- Feature-Sliced Lite boundaries;
- centralized Chinese UI text;
- smoke evidence against the old backend;
- desktop and mobile visual checks;
- lint, build, overflow, and encoding checks.

## Standard Phases

### Phase 1: API Contract

Read before implementing:

- old frontend API calls, usually `D:\CodeProject\auto\web\src\api\platform.ts`;
- old frontend page/component usage;
- backend Controller;
- backend request and response DTOs;
- relevant enum classes;
- optional knowledge graph at `D:\CodeProject\auto\.understand-anything\knowledge-graph.json` for navigation.

Update:

- `docs/api-contract.md`;
- `src/shared/api/endpoints.ts`.

Rules:

- Do not guess endpoint paths.
- Do not invent CRUD operations that backend does not expose.
- Record mismatches between old frontend payloads and backend DTOs in contract notes.

### Phase 2: Entity Layer

Create or update:

- `src/entities/<module>/model/types.ts`;
- `src/entities/<module>/api/<module>Api.ts`;
- `src/entities/<module>/lib/*Payload.ts` when forms need mapping;
- `src/entities/<module>/index.ts`.

Rules:

- Entity APIs call only verified endpoint keys.
- Keep request/response types aligned with backend DTOs.
- Normalize backend page responses only inside entity API or entity lib helpers.
- Do not import features, widgets, or pages from entities.

### Phase 3: Readonly Surface

Create:

- `src/widgets/<module>-readonly` or a similarly named module widget;
- page composition under `src/pages/<module>`.

Readonly surface should usually include:

- summary/statistics when available;
- list or tree;
- detail preload or drawer when available;
- empty, loading, and error states.

Rules:

- Pages only compose.
- Widgets own page regions.
- Readonly smoke must pass before adding action features.

### Phase 4: Action Features

Implement actions as separate features:

- `features/<module>-create`;
- `features/<module>-edit`;
- `features/<module>-delete`;
- `features/<module>-transition`;
- `features/<module>-comment-add`;
- `features/<module>-attachment-*`;
- other business actions as needed.

Rules:

- Each feature owns its dialog/button/model composable.
- Feature success emits back to the widget for refresh.
- Use `shared/lib/feedback.ts` instead of direct Arco `Message` or `Modal` in business code.
- Do not combine unrelated actions just because they share a page.

### Phase 5: Smoke Verification

Each meaningful phase gets a script under `scripts/` and a record under `docs/smoke/`.

Smoke scripts should verify:

- login;
- required API calls return expected status;
- key UI text renders;
- create/edit/delete/transition/comment/upload flows where applicable;
- detail preload when editing depends on detail fields;
- cleanup when backend exposes delete.

When backend has no delete endpoint, use timestamped smoke data and record that cleanup is not available.

### Phase 6: Visual And Overflow Verification

For module closeout, add or run a visual smoke script:

- desktop `1440x960`;
- mobile `390x844`;
- detail drawer or main interaction state if relevant;
- horizontal overflow check on `documentElement` and `body`;
- page errors and console errors.

Screenshots go under:

```text
output/playwright/
```

### Phase 7: Module Closeout

Create:

```text
docs/smoke/YYYY-MM-DD-<module>-module-closeout.md
```

Closeout must include:

- scope and out-of-scope;
- migrated capabilities matrix;
- contract sources;
- smoke runs and screenshots;
- visual and overflow checks;
- quality gates;
- architecture shape;
- not-final-UI notes;
- result.

## Quality Gates

Run before claiming a module is closed out:

```powershell
npm.cmd run lint
npm.cmd run build
Run the existing mojibake keyword scan used in module closeout.
Get-ChildItem -Path src -Recurse -File | Select-String -Pattern '[\u4e00-\u9fff]' | Where-Object { $_.Path -notlike '*src\shared\i18n\zh-CN.ts' } | Select-Object Path,LineNumber,Line
```

Expected:

- lint passes;
- build passes;
- mojibake scan returns no rows;
- Chinese string scan returns no rows outside `src/shared/i18n/zh-CN.ts`.

The known Vite chunk-size warning from Arco is not a module blocker.

## Parallel Work Rules

Parallel sessions are safe only when the work is contractually independent.

Safe parallel examples:

- one session reads API contract for a future module while the main session closes out the current module;
- separate sessions implement features under different modules after contract and entity boundaries are already defined;
- one session writes smoke docs while another writes visual smoke, if they do not edit the same file.

Avoid parallel work when:

- multiple sessions would edit `src/shared/api/endpoints.ts`;
- multiple sessions would edit `docs/api-contract.md` for the same module;
- entity types are still unstable;
- the module has not passed readonly smoke yet.

Hand off every parallel task with:

- module scope;
- files allowed to edit;
- contract rows to follow;
- smoke script expected;
- out-of-scope list.

## Current Sample Modules

| Module | Status | Closeout |
| --- | --- | --- |
| Config Center | Closed | `docs/smoke/2026-06-07-config-center-module-closeout.md` |
| Case Center | Closed | `docs/smoke/2026-06-07-case-center-module-closeout.md` |
| Bug Management | Closed | `docs/smoke/2026-06-07-bug-management-module-closeout.md` |

## Next Recommended Module

The next major module should be API Automation, but it should not start with page implementation.

Recommended first goal:

```text
Complete API Automation API contract, old-project structure analysis, and frontend 2.0 module decomposition.
```

Reasons:

- API Automation has more subdomains than previous modules.
- It likely includes API definitions, grouping, request editor, debug execution, assertions, variables, processors, reports, and bug creation from failures.
- Its implementation should be split into smaller independently verified phases.
