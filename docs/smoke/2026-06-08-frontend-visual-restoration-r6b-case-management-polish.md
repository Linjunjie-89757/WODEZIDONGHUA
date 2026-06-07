# Frontend Visual Restoration R6B - Case Management Polish

## Scope

- Polished the Case Center case management table against `olddesign/src/app/components/TestCasePage.tsx`.
- Replaced create/edit dialogs with a 480px right-side drawer shell while preserving the existing case CRUD contract.
- Refined directory/path display inside the drawer without adding a new backend contract.
- Added an olddesign-like row action area. Edit and delete remain real actions; execute/review/bug/copy are visual-only or disabled until their contracts are confirmed.

## Visual Changes

- Table columns now follow the olddesign order: case number, case name, status, priority, validation mode, executor, workspace, case path and sticky actions.
- Table density now uses compact header/body padding, fixed widths and olddesign-like hover/sticky action behavior.
- Status and priority badges now use olddesign-like green/red/neutral and P0/P1/P2 color treatments.
- Create/edit now open a right drawer with a compact header, path row, priority segmented control, form body and grey footer.
- Directory selection is represented as a path row plus folder button. Because no confirmed write contract exists for path selection in this feature scope, the button opens an explanatory visual modal instead of mutating payload data.

## Smoke Coverage

Updated `scripts/smoke-case-center-visual.mjs` to cover:

- Login and Case Center case management tab.
- Case table headers and olddesign column names.
- Create drawer opening and directory/path display.
- Edit drawer opening when case rows exist.
- AI tabs remain reachable after R6B changes.
- Desktop/mobile screenshots.
- Horizontal overflow checks.

## Contract Notes

- Existing `createCase` and `updateCase` payloads are unchanged.
- The drawer still writes `title`, `caseType`, `priority`, `sourceType`, `caseStatus`, `precondition`, `steps` and `expectedResult` through the existing entity helpers.
- Directory path selection writeback is intentionally not implemented in R6B because the feature scope does not add or change backend contract.
- Review, create bug, copy and execute are not implemented as business actions in this phase.

## Screenshots

- Desktop case management: `output/playwright/case-center-module-desktop-20260607225652.png`
- Desktop create drawer: `output/playwright/case-center-create-drawer-desktop-20260607225652.png`
- Desktop edit drawer: `output/playwright/case-center-edit-drawer-desktop-20260607225652.png`
- Mobile case management: `output/playwright/case-center-module-mobile-20260607225652.png`
- Mobile create drawer: `output/playwright/case-center-create-drawer-mobile-20260607225652.png`
- Mobile edit drawer: `output/playwright/case-center-edit-drawer-mobile-20260607225652.png`

## Verification

Passed commands:

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`
- `npm.cmd run smoke:case-center-visual`
- Mojibake scan: 0 matches for `�|Ã|Â|鍦|璇|鎺|楠|绛`
- Chinese scatter scan in Vue files: 0 matches
- Feature-Sliced boundary scan: 0 matches for `@pages|@widgets|@features`

Smoke result:

- Desktop and mobile passed.
- No horizontal overflow on desktop or mobile.
- Create drawer screenshot was captured on desktop and mobile.
- Edit drawer screenshot was captured on desktop and mobile because the smoke data contained 4 editable rows.

Residual note:

- Smoke observed `401` console resource messages after login, but there were no page errors and the visual flow passed. This looks like an existing authenticated-resource request rather than an R6B UI regression.
