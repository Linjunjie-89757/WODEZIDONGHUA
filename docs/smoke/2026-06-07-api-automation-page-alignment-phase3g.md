# API Automation Page Alignment Phase 3G

Date: 2026-06-07

## Scope

Phase 3G refines the API definition request editor toward the old-project table density and embedded cases tab.

Implemented:

- headers, params, and form body rows now expose advanced table fields:
  - enabled;
  - parameter name;
  - parameter type;
  - required marker;
  - parameter value;
  - length range;
  - encoding for headers and params;
  - description;
  - row delete;
- body mode chips now include `none`, `x-www-form-urlencoded`, `json`, `xml`, and `text`;
- raw body editing uses the same raw text field while preserving body type;
- cases tab now renders the embedded case list in a denser table-like shell;
- embedded cases show ID, name, method, priority, status, path, detail, run, edit, and delete entry points;
- Phase 1-3 smoke creates a temporary case in the embedded cases tab, validates the density shell and detail entry, then cleans test data by API before deleting the definition.

Not implemented:

- curl import;
- AI generation;
- true batch-add drawer;
- file picking for body form `file` rows;
- drag sorting;
- old-project table column settings;
- pixel-level old-project reproduction.

## Contract Notes

- No new backend API contract was added.
- The old project reference confirms `ApiKeyValue` already supports `paramType`, `required`, `encode`, `minLength`, `maxLength`, file metadata, and body raw variants.
- The new frontend entity model now preserves those fields when editing and saving definitions.
- Batch add is currently a visible placeholder entry only; it does not call a new API.

## Smoke Coverage

Updated script:

- `scripts/smoke-api-automation-phase1-3.mjs`

Covered:

- advanced parameter table controls for headers;
- advanced parameter table controls for params;
- advanced parameter table controls for body form;
- body mode switching across JSON/form/raw paths;
- embedded cases tab with temporary case creation;
- embedded cases density shell and detail entry;
- debug send and response display;
- assertion result display;
- screenshot capture;
- horizontal overflow checks;
- API cleanup for temporary cases before deleting the definition.

Latest screenshot paths are emitted by the smoke script:

- full page: `output/playwright/api-automation-phase3b-<stamp>.png`
- request editor detail: `output/playwright/api-automation-phase3f-editor-<stamp>.png`

## Risks

- This is still a visual and structural alignment pass, not pixel-level reproduction.
- Batch add is not functional yet; it is only a shell-level affordance for the old-project table layout.
- Body mode support is limited to basic display/edit semantics and does not implement binary or file upload behavior.
- Embedded cases reuse the current case management widget, with density styling and extra columns, but not the full old-project table settings drawer.
- Smoke still logs the expected unauthenticated `GET /api/auth/me` 401 before login.
- Runtime Vue `toRefs()` warnings are still observed during smoke, with no page errors.
