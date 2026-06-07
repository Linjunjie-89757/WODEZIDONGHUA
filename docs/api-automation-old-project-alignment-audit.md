# API Automation Old Project Alignment Audit

Date: 2026-06-07

## Scope

This audit compares the copied old-project reference files under `reference/old-auto` with the current AutoTestHub API Automation implementation.

Reference files are read-only inputs for this audit:

- `reference/old-auto/ApiAutomationWorkspace.vue`
- `reference/old-auto/api.ts`
- `reference/old-auto/knowledge-graph.json`

Current AutoTestHub files reviewed:

- `src/widgets/api-automation-shell/ui/ApiAutomationShell.vue`
- `src/widgets/api-automation-shell/ui/ApiDefinitionList.vue`
- `src/features/api-definition-debug/ui/ApiDefinitionDebugPanel.vue`
- `src/widgets/api-case-management/ui/ApiCaseManagement.vue`
- `src/widgets/api-scenario-management/ui/ApiScenarioManagement.vue`
- `src/features/api-scenario-save/ui/ApiScenarioDialog.vue`
- `src/features/api-scenario-save/ui/ApiScenarioStepEditor.vue`
- `src/widgets/api-run-result-panel/ui/ApiRunResultPanel.vue`
- `src/entities/api-automation/model/types.ts`

The copied old reference file contains visible mojibake in some Chinese text. This audit uses it for structure, component hierarchy, class names, state names, and workflow shape only. Do not reuse the mojibake text in AutoTestHub.

## Old Project Shape

The old project is a dense API testing workbench, not a stacked card page.

Top-level information architecture:

- `activeTab` supports `definitions`, `scenarios`, `execution`, `reports`, and `settings`.
- The definitions tab starts at `ApiAutomationWorkspace.vue:7146`.
- The scenarios tab starts at `ApiAutomationWorkspace.vue:9438`.

Definitions workbench:

- Left sidebar has create/import actions, search, directory title, collapsible module tree, and request nodes.
- Main area uses request editor tabs with active state, dirty dot, close action, horizontal overflow controls, and add tab action.
- Request editor has a command row with method select, URL input, curl import, send button, and save dropdown.
- Request content is organized by tabs: headers, body, params, auth, pre, post, tests, settings, and cases.
- Response is a paired shell, visually related to the request editor instead of a separate card below it.

Scenario workbench:

- Left sidebar has scenario create, search, module tree, directory counts, and module actions.
- Main area has scenario editor tabs with dirty dot, close, add, close others, and close all.
- The scenario list is table-like with toolbar, search, filters, refresh, selection, ID, name, priority, status, run result, tags, environment, fixed action column, and pagination.
- Editing a scenario happens in a workbench pane, not primarily in a modal.
- Scenario detail has inner tabs: steps, params, assertions, history, settings.
- Scenario edit uses a right property panel for environment, run/save/delete, name, module, priority, status, default environment, variable set, tags, and description.

Step editor:

- Step rows are tree-like rows with checkbox, order, enable switch, single-step run button, type badge, inline fields, name editing, and icon actions.
- Add-step menu groups commands by request/scenario, logic controllers, and others.
- Supported step types include `API`, `API_CASE`, `CUSTOM_REQUEST`, `API_SCENARIO`, `IF_CONTROLLER`, `LOOP_CONTROLLER`, `ONCE_ONLY_CONTROLLER`, `SCRIPT`, and `CONSTANT_TIMER`.
- Custom request, system request, and script steps open focused drawers with their own request-content tabs.

Relevant old CSS sections:

- `.api-tabs` around `ApiAutomationWorkspace.vue:11675`.
- `.ms-like-layout` and `.scenario-workbench` around `ApiAutomationWorkspace.vue:11819`.
- `.scenario-editor-tab-strip` around `ApiAutomationWorkspace.vue:12181`.
- `.scenario-detail-tabs` around `ApiAutomationWorkspace.vue:12454`.
- `.scenario-property-panel` around `ApiAutomationWorkspace.vue:12541`.
- `.ms-like-request-shell` around `ApiAutomationWorkspace.vue:14580`.

## Current AutoTestHub Shape

AutoTestHub currently has a clean Feature-Sliced Lite structure and a working API Automation module, but the screen structure is still closer to a modular migration page than the old workbench.

Current strengths:

- `ApiAutomationShell.vue` composes modules, context selectors, definitions, debug, cases, and scenarios without becoming a huge single-file page.
- API entities and contract live under `entities/api-automation`.
- Save, run, delete, debug actions remain in features.
- `ApiScenarioStepEditor.vue` is scoped inside `features/api-scenario-save`, which keeps the scenario save action self-contained.
- `ApiRunResultPanel.vue` is already shared across definition debug, case run, and scenario run.

Current structure gaps:

- `ApiAutomationShell.vue` still stacks sections in cards after summary metrics.
- There is no top-level API Automation tab shell for definitions, scenarios, execution, reports, and settings.
- Definition editing and debug do not use a tabbed request editor.
- `ApiDefinitionDebugPanel.vue` only exposes selected definition name and send action; it does not render request method/path/content tabs.
- Case and scenario management are embedded sections rather than first-class workbench tabs.
- `ApiScenarioManagement.vue` uses a grid plus drawer/detail modal pattern, not old-style scenario editor tabs and right property panel.
- `ApiScenarioDialog.vue` keeps scenario editing in a modal; old project edits scenarios in the main workbench.
- `ApiScenarioStepEditor.vue` is functionally complete for current phases but looks like a form editor, not a tree/list workbench.
- `ApiRunResultPanel.vue` is reusable, but response/body/headers/assertions/processors/steps/raw are still presented as a simple tabbed panel rather than a request-response workbench companion.

## Gap Matrix

| Area | Old project pattern | Current AutoTestHub | Recommendation |
| --- | --- | --- | --- |
| Top navigation | API tabs: definitions, scenarios, execution, reports, settings | Single page with stacked sections | Add an API automation workbench tab shell. Start with definitions/scenarios/cases mapped to existing widgets; keep execution/reports/settings as deferred placeholders only if needed. |
| Definition sidebar | Directory tree with actions, search, counts, request nodes | Module card plus list card | Merge module tree and definition list into a left directory/list rail. Preserve current API data and feature actions. |
| Request editor | Multi-tab editor with dirty state and close tabs | Definition dialog plus simple debug panel | Build a lightweight request editor shell before deep editor tabs. It can initially open one selected definition plus one draft tab. |
| Request command row | Method + URL + Curl + Send + Save dropdown | Send button only | Add command strip visual using existing definition data. Do not expand contract until editor save requirements are explicit. |
| Request content tabs | Headers/body/params/auth/pre/post/tests/settings/cases | Existing form fields live mainly in dialogs | Move toward tab shell gradually; first render read-only or existing editor fields inside tabs. |
| Response panel | Paired response shell beside/below request editor | Shared result panel in separate card/drawer | Keep `api-run-result-panel`, but wrap it in a workbench response shell with stronger request-response hierarchy. |
| Scenario list | Table with toolbar, filters, selection, fixed actions, pagination | Compact custom list rows | Convert scenario list to table-like workbench density. Keep CRUD contracts unchanged. |
| Scenario editing | Editor tabs plus main steps area plus right property panel | Modal dialog with step editor | Create scenario editor workspace shell. Reuse `ApiScenarioStepEditor` first; later split property panel fields out of modal. |
| Step editor | Tree rows with type badge, enable switch, order, run, inline controls | Form cards with select/input/actions | First visual pass: row-based tree, compact type badge, icon actions. No drag/drop. |
| Step drawers | Custom request/system request/script drawers with request tabs | Inline fields in step editor | Defer. Next implementation can add focused drawers for custom request and script only after workspace shell is stable. |
| Execution/reports/settings | Dedicated old tabs exist | Not migrated | Defer. Do not create fake functionality. |

## Recommended Next Phases

### Phase 3A: Workbench Shell Alignment

Goal: make the page shape match the old project without changing business contracts.

Implement:

- Add `ApiAutomationWorkbenchTabs` or equivalent widget-level shell.
- Split visible areas into definitions, cases, and scenarios tabs.
- Keep existing widgets mounted inside tab panes at first.
- Remove the stacked-card feeling inside the API Automation module.
- Make run context selectors part of the workbench header/toolbar.
- Keep summary metrics compact or move them into the header as secondary status.

Do not implement:

- Execution, reports, settings functionality.
- Full request editor tabs.
- New backend APIs.

### Phase 3B: Definition Request Editor Shell

Goal: make definition debug/editing feel like the old request workbench.

Implement:

- Directory/list rail on the left.
- Request editor tab strip with at least selected definition and draft tab support.
- Command strip with method, path, send, and save/edit action.
- Lightweight request content tabs using existing fields: params, headers, body, assertions, processors.
- Place `ApiRunResultPanel` in a response shell directly tied to the request editor.

Do not implement:

- Curl import unless the current contract already supports it clearly.
- AI case generation.
- Reports/settings.

### Phase 3C: Scenario Editor Workspace

Goal: move scenario editing from modal-first to workbench-first.

Implement:

- Scenario module rail plus scenario table/list.
- Scenario editor tabs with dirty indicator and close action.
- Main scenario edit area with inner tabs: steps, params, assertions, history, settings.
- Right property panel using existing scenario form fields.
- Reuse `ApiScenarioStepEditor` initially, then restyle into row-based tree.

Do not implement:

- Full old import drawer.
- API scenario nested reference beyond current supported contract.
- Advanced controller expansion beyond already implemented controller types.

### Phase 3D: Step Editor Precision Pass

Goal: align step editing interactions after the scenario workbench shell exists.

Implement:

- Tree/list row layout.
- Step type badge.
- Enable switch.
- Inline order.
- Icon actions for add child, move up/down, delete.
- Compact controller fields inside the row.
- Optional focused drawer for custom request/script if the row becomes too dense.

Do not implement:

- Drag and drop.
- New controller types.
- AI generation.

## Implementation Guardrails

- Keep `reference/old-auto` read-only and out of commits.
- Preserve Feature-Sliced Lite:
  - pages compose only;
  - widgets own workbench regions;
  - features own create/edit/delete/run/debug actions;
  - entities own API contracts and normalization;
  - shared owns reusable UI, feedback, i18n, and styles.
- Do not recreate the old single-file component shape.
- Do not copy old mojibake Chinese text.
- Keep Chinese UI strings in `src/shared/i18n/zh-CN.ts`.
- Keep Arco messages and confirmations through `shared/lib/feedback`.
- Prefer structural alignment first, then detailed visual tuning.

## Suggested Next Goal Text

Create goal:

Complete AutoTestHub API Automation page experience alignment Phase 3A: workbench shell alignment based on `docs/api-automation-old-project-alignment-audit.md`. Only modify `D:\CodeProject\AutoTestHub`; do not modify or commit `reference/old-auto`. Implement a tabbed API automation workbench shell that separates definitions, cases, and scenarios, moves run context selectors into a compact workbench toolbar/header, reduces stacked-card layout, and preserves all existing API contracts and Feature-Sliced Lite boundaries. Do not implement execution, reports, settings, curl import, AI generation, or new business functionality. Keep Chinese UI text in `src/shared/i18n/zh-CN.ts` and feedback through `shared/lib/feedback`. Complete typecheck, lint, build, key smoke, screenshots, horizontal overflow check, mojibake scan, scattered Chinese scan, boundary scan, and local git commit. Final output must include modified files, validation results, screenshot paths, residual risks, and next-step recommendation.

