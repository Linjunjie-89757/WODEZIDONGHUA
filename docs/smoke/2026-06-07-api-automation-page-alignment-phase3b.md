# API Automation Page Alignment Phase 3B

Date: 2026-06-07

## Scope

This record covers Phase 3B request editor shell alignment for the API Automation definitions tab.

Included:

- Added a definition request editor shell inside the existing Phase 3A workbench.
- Added a lightweight editor tab strip for the selected definition.
- Added a method/path command row with send and edit/save entry points.
- Added foundational request content tabs: headers, body, params, auth, pre, post, tests, settings, and cases.
- Added a response shell that hosts the existing shared `ApiRunResultPanel`.
- Kept create/edit/delete/debug behavior on the existing contracts and feature hooks.
- Updated smoke coverage for editor shell, command row, content tabs, send, response panel, screenshot, and horizontal overflow.

Not included:

- Curl import.
- AI generation.
- New backend APIs.
- In-place editing of request headers/body/params inside the shell.
- Replacing the existing definition edit dialog.
- Pixel-perfect old frontend reproduction.

## Old Project Reference

Reference source used:

```text
reference/old-auto/ApiAutomationWorkspace.vue
```

Key old-project structure referenced:

- Request shell around `ms-like-request-shell`.
- Method/path/send/save command row around `ms-like-request-row`.
- Request content tabs around `ms-like-top-tabs`.
- Response shell around `ms-like-response-shell`.

## Verification

Commands:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run smoke:api-if-loop
node scripts\smoke-api-automation-phase1-3.mjs
node scripts\smoke-api-automation-phase5-7.mjs
```

Results:

- `npm.cmd run typecheck`: pass.
- `npm.cmd run lint`: pass.
- `npm.cmd run build`: pass. Existing Vite chunk-size warning remains.
- `npm.cmd run smoke:api-if-loop`: pass.
- `node scripts\smoke-api-automation-phase1-3.mjs`: pass.
- `node scripts\smoke-api-automation-phase5-7.mjs`: pass.
- Mojibake scan: pass.
- Scattered Chinese scan outside `src/shared/i18n/zh-CN.ts`: pass.
- Feature-Sliced boundary scan for shared/entities/features: pass.

## Screenshots

```text
output/playwright/api-automation-phase3b-20260607092638.png
output/playwright/api-scenario-if-loop-20260607092716.png
output/playwright/api-automation-phase5-7-20260607092817.png
```

## Risks

- Request content tabs are structural shells in this phase; detailed in-place editors remain in the existing dialog until a later phase.
- The command-row save action opens the current edit dialog instead of saving inline, because this phase does not change the API contract or form ownership.
- Case tab content remains linked to the workbench case tab for now.
