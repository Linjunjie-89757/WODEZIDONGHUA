# API Automation Page Alignment Phase 3L Closure Audit

Date: 2026-06-07

## Scope

Phase 3L is a documentation and audit phase. It does not implement page changes.

Reviewed:

- Completed Phase 3A-3K smoke notes.
- Latest Playwright screenshots from Phase 3J/3K:
  - `output/playwright/api-automation-phase3b-20260607125353.png`
  - `output/playwright/api-automation-phase3h-editor-20260607125353.png`
  - `output/playwright/api-automation-phase3k-scenario-20260607125353.png`
  - `output/playwright/api-scenario-if-loop-20260607125534.png`
- Old project reference under `reference/old-auto`, especially:
  - `ApiAutomationWorkspace.vue`
  - `ApiCaseDrawer.vue` import and usage
  - `ms-like-layout`
  - `ms-like-sidebar`
  - `ms-like-main`
  - `ms-like-tab-strip`
  - `ms-like-response-shell`
  - `case-list-table`
  - `ms-scenario-table`
  - `scenario-property-card`
  - `scenario-step-tree`
  - `scenario-step-node`

## Audit Summary

The API Automation module is now aligned at the structure and workflow level. It has:

- API definition rail/list/editor/response surfaces.
- Embedded request content tabs for headers, params, body, auth, pre, post, tests, settings, and cases.
- Case management readonly/detail/run entry surfaces.
- Scenario list/editor tabs.
- Scenario step tree with nested steps and advanced controllers.
- Scenario right property panel.
- Shared run result panel used by definition debug, case run, and scenario run.

The remaining gap is not broad missing functionality. It is mostly old-project component parity:

- Old response panels have a stronger `ms-like-response-shell` hierarchy.
- Old case management uses a dedicated drawer with detail/run-history/change-history views.
- Old scenario lists and module rails are denser and table/tree-like.
- Old dialogs and drawers have tighter title/body/footer rhythm.
- Narrow/mobile behavior has only been checked for overflow, not tuned visually.

## Gap Matrix

| Area | Gap Type | Remaining Gap | Recommended Phase |
| --- | --- | --- | --- |
| Response panel | Visual | Current shared result panel works, but does not yet match old response shell header, metrics, tabs, empty state, and content panel hierarchy. | Phase 3M |
| API cases | Visual + Interaction | Cases are embedded, but old `ApiCaseDrawer` detail/run-history/change-history experience is not reproduced. | Phase 3N |
| Scenario rail/list | Visual | Scenario module rail still has large empty-card feel; old project uses denser tree/table shell. | Phase 3O |
| Scenario steps | Visual + Interaction | Step tree is closer after 3K, but old inline edit affordance and selected-step inspector are not complete. | Phase 3O |
| Dialogs/drawers | Visual | Batch drawer is tuned, but create/edit dialogs and other drawers are still mixed. | Phase 3P |
| Narrow viewport | Visual | Smoke checks no document-level horizontal overflow, but not old-project responsive details. | Phase 3Q |
| Persistent scenario history | Contract | Workbench shows latest run step results; persistent scenario run-history contract is not confirmed in new entity layer. | Contract phase before implementation |
| Drag sorting | Interaction | Request parameter and scenario step drag sorting are not implemented. | Optional scoped phase |

## Recommended Follow-Up Order

1. Phase 3M: response shell parity.
   - Align `ApiRunResultPanel` with old `ms-like-response-shell`.
   - Keep existing run response contracts.

2. Phase 3N: case drawer and case management parity.
   - Align list density and case detail/run-history/change-history drawer surfaces.
   - Reuse the shared response shell after Phase 3M.

3. Phase 3O: scenario rail/list/step inspector polish.
   - Align scenario module rail, scenario table, and step tree affordances.
   - Evaluate selected-step inspector as visual shell only unless contract requires more.

4. Phase 3P: dialog/drawer consistency pass.
   - Normalize API Automation create/edit dialogs and drawers.

5. Phase 3Q: narrow viewport audit.
   - Decide whether this module is desktop-first or responsive with controlled collapse.

## Validation Plan

Phase 3L should keep verification light because it does not change page code:

- `npm.cmd run lint`
- `npm.cmd run build`
- `node scripts\smoke-api-automation-phase1-3.mjs`
- Mojibake scan for `src`, `docs`, and `scripts`
- Chinese scattered text scan for `src`
- Feature-Sliced boundary scan

## Known Limits

- This audit does not claim pixel-level old project reproduction.
- Old project reference is still local-only and untracked.
- Existing historical mojibake patterns remain in `src/shared/i18n/zh-CN.ts` and some smoke scripts.
- Existing Vue warning `toRefs() expects a reactive object but received a plain one` still appears during smoke.
- Initial unauthenticated `GET /api/auth/me` returns `401` before login during smoke; this is expected.
