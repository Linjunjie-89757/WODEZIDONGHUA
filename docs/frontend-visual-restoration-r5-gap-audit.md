# Frontend Visual Restoration R5 Gap Audit

## Scope

This audit covers the visual restoration work completed in R0-R4:

- Login-after main shell and dashboard
- Case Center: case management, AI generation, AI generation records, AI config
- System Settings: AI connections, workspace management
- Config Center: environment config, parameter sets, database connections

The goal is to turn "does it look like the old project?" into a concrete refinement backlog.

## Sources Used

Visual source:

- `D:\CodeProject\AutoTestHub\olddesign\src\app\App.tsx`
- `D:\CodeProject\AutoTestHub\olddesign\src\app\components\TestCasePage.tsx`
- `D:\CodeProject\AutoTestHub\olddesign\src\app\components\AiHistoryPage.tsx`
- `D:\CodeProject\AutoTestHub\olddesign\src\app\components\AiConfigPage.tsx`
- `D:\CodeProject\AutoTestHub\olddesign\src\app\components\SettingsPage.tsx`
- `D:\CodeProject\AutoTestHub\olddesign\src\app\components\WorkspaceConfig.tsx`
- `D:\CodeProject\AutoTestHub\olddesign\src\app\components\ConfigCenterPage.tsx`

Reference source:

- `D:\CodeProject\AutoTestHub\reference\old-auto\api.ts`
- `D:\CodeProject\AutoTestHub\reference\old-auto\ApiAutomationWorkspace.vue`
- `D:\CodeProject\AutoTestHub\reference\old-auto\knowledge-graph.json`

Current screenshots:

- `output/playwright/dashboard-visual-desktop-20260607170816.png`
- `output/playwright/dashboard-visual-mobile-20260607170816.png`
- `output/playwright/case-center-module-desktop-20260607170816.png`
- `output/playwright/case-center-ai-desktop-20260607170816.png`
- `output/playwright/system-settings-ai-desktop-20260607170816.png`
- `output/playwright/system-settings-workspace-desktop-20260607170816.png`
- `output/playwright/config-center-env-desktop-20260607170816.png`
- `output/playwright/config-center-param-desktop-20260607170816.png`
- `output/playwright/config-center-db-desktop-20260607170816.png`

## Summary

| Area | Current Similarity | Status | Main Reason |
| --- | ---: | --- | --- |
| Main shell / dashboard | 78% | Good first-pass | Shell dimensions and density are close; dashboard content is still partly placeholder-driven. |
| Case management | 74% | Good first-pass | Main layout, rail and table density are close; drawer/edit interactions still differ from olddesign. |
| Case AI generation | 58% | Visual shell | Page composition exists, but real generation flow and old task detail behavior are not connected. |
| Case AI records | 62% | Visual shell | Stats/table shape is present; detail/adoption screen is not implemented. |
| Case AI config | 70% | Partial | Role-card visual is close; persistence contract is missing. |
| System Settings / AI connections | 72% | Good first-pass | Stats/cards/provider grid align; modal/provider logos and exact old card behavior are not fully reproduced. |
| System Settings / workspace management | 60% | Readonly shell | Uses real workspace list, but create/edit/member flows need contract and drawer/modal work. |
| Config Center | 73% | Good first-pass | Nav, stats and cards align; olddesign tables/modals are not fully matched. |

These percentages are practical engineering estimates based on source structure, R0-R4 screenshots and remaining deltas. They are not pixel-diff scores.

## Page Findings

### Main Shell / Dashboard

Current match:

- Sidebar width, dark color, active blue state and 56px top/header rhythm are close to `App.tsx`.
- Dashboard now has stats, module entries, quick actions and recent work table instead of placeholders.
- Desktop and mobile smoke show no horizontal overflow.

Remaining gaps:

- Dashboard metrics are still local visual data, not old backend dashboard summary data.
- Sidebar collapse behavior is not implemented.
- Exact icon set differs because AutoTestHub uses its existing icon-free/simple component approach rather than copying Lucide SVG usage from olddesign.
- Module card copy and progress panels are visually plausible but not old-project exact.

Direct frontend refinements:

- Tighten dashboard table row height, module card spacing and quick-action hover states against `App.tsx`.
- Add optional sidebar collapsed state only if the old runtime proves it matters for daily use.
- Normalize topbar workspace selector and user block spacing against old screenshot.

Needs contract:

- Real dashboard summary counts and recent-work feed.

Recommended next phase:

- R6A: main shell/dashboard pixel polish after old runtime screenshots are captured side-by-side.

### Case Center / Case Management

Current match:

- Top segmented tabs match the olddesign `h-12` strip pattern.
- Left category rail width and compact directory rows follow `TestCasePage.tsx`.
- Case list is now a dense table with sticky action column.

Remaining gaps:

- Case create/edit still uses existing dialog flow, while olddesign uses a right-side edit drawer and path selector modal.
- Row action menu is simplified; olddesign has hover menu with review, bug, copy and delete actions.
- Filters are visual shells and not all tied to backend query.
- Mobile layout is readable but not olddesign-authored; olddesign mainly targets desktop workbench density.

Direct frontend refinements:

- Rework case edit into a 480px right drawer using current case CRUD contract.
- Add olddesign-like path selector modal for directory selection.
- Tighten table column widths, operation column menu and badge colors.
- Add row hover actions for review/bug/copy as visual entries if contract exists; otherwise document disabled state.

Needs contract:

- Review action.
- Create bug from case.
- Copy case.
- Filter query contract for priority/status/execution/owner.

Recommended next phase:

- R6B: Case management drawer and table-action polish.

### Case Center / AI 用例生成

Current match:

- Requirement form, output mode selector, process cards and result empty area follow the olddesign direction.
- The tab entry and content density are coherent with the Case Center workbench.

Remaining gaps:

- Olddesign's AI generation runtime is task/event based; current page does not create a real task.
- Result table and adoption workflow are not implemented.
- Asset/requirement import is not connected.
- Process area is static, not driven by task events.

Direct frontend refinements:

- Once contract is available, replace the static process shell with event timeline rows.
- Implement generated-case table and selected/adopt-all actions using confirmed payloads.
- Add a task detail panel that shares styling with AI records.

Needs contract:

- Create AI generation task endpoint.
- Task event stream or polling endpoint.
- Adopt generated cases endpoint.
- Delete/retry/cancel task endpoints.

Recommended next phase:

- R6C should not start with visual polish. First do Case AI controller contract补读, then implement real task flow.

### Case Center / AI 生成记录

Current match:

- Stats cards, filter row and dense task table resemble `AiHistoryPage.tsx`.
- Status badge structure is in place.

Remaining gaps:

- Table currently uses a contract-limited placeholder row.
- Olddesign detail view includes breadcrumb, stats row, generated-case table and adoption actions; not implemented.
- Delete/retry/adopt-all behaviors are not wired.

Direct frontend refinements:

- Build the olddesign detail view shell after list contract is confirmed.
- Add consistent task status badges and event count fields.

Needs contract:

- List task records.
- Task detail.
- Adopt/delete/retry/cancel actions.

Recommended next phase:

- Fold into R6C after Case AI contract補读.

### Case Center / AI 配置

Current match:

- Two role cards map closely to `AiConfigPage.tsx`: generator/reviewer, enable switch, model select, sliders and prompt textarea.
- Model select reads real AI connection pool data.

Remaining gaps:

- Save/test actions are feedback-only because role config persistence endpoint is not confirmed.
- Provider/model dropdown visuals are simpler than olddesign's custom dropdown.
- Tooltip helper text from olddesign is represented by plain labels and helper copy.

Direct frontend refinements:

- Make model selector more olddesign-like: provider badge, selected checkmark, custom dropdown row density.
- Add tooltip treatment for Temperature and Top-p.

Needs contract:

- Read/save generator and reviewer AI role config.
- Test selected role config.

Recommended next phase:

- R6D after contract补读, or combine with R6C if Case AI endpoints are copied.

### System Settings / AI 连接

Current match:

- Secondary settings nav, stats cards, connection cards and provider grid are close to `SettingsPage.tsx`.
- Existing AI connection CRUD/test features are preserved.
- Smoke covers AI connection page on desktop/mobile with no overflow.

Remaining gaps:

- Add/edit modal still uses existing Arco dialog, not the richer olddesign provider-selection modal.
- Provider logos are approximated with initials instead of olddesign logo SVGs.
- Connection card hover icon-only behavior is simplified through existing feature buttons.
- Provider grid count and logo treatment are close, but not pixel exact.

Direct frontend refinements:

- Implement olddesign-style provider selection modal while still mapping to current `SaveAiProviderConnectionPayload`.
- Replace initials with provider logo components or static assets if acceptable.
- Tighten card header/action opacity, model chip and URL typography.

Needs contract:

- Fetch models endpoint already exists but UI does not expose the olddesign "获取模型列表" flow in the create/edit modal.
- Provider-specific capability details, if required.

Recommended next phase:

- R6E: AI connection modal/provider-logo refinement.

### System Settings / 空间管理

Current match:

- Secondary settings shell matches R3.
- Workspace card layout follows `WorkspaceConfig.tsx` density.
- Data reads real workspace list from old backend.

Remaining gaps:

- Create/edit/member management are not implemented.
- Workspace type icon/gradient treatment is simplified.
- Member detail page, admin/member list, permission tabs and operation log tabs are missing.

Direct frontend refinements:

- Add readonly member-management detail shell if workspace member list contract is already available.
- Tighten workspace card icon, status badge and meta chips.

Needs contract:

- Workspace create/update/delete.
- Workspace member list.
- Add/remove admin/member.
- Permission settings and operation log.

Recommended next phase:

- R6F: workspace contract补读, then workspace modal/member page implementation.

### Config Center / 三页面

Current match:

- Config Center now uses olddesign-like secondary nav and right workbench.
- Existing real CRUD/toggle/test features are preserved.
- Stats and list cards are compact and consistent with `ConfigCenterPage.tsx`.

Remaining gaps:

- Olddesign environment page uses two-column cards with stronger type-specific badges; current shared list row is more generic.
- Olddesign parameter page uses a dense table with filter chips; current version uses card rows.
- Olddesign database page uses wide connection rows with type icons and status actions; current version uses shared card rows.
- Create/edit dialogs remain current Arco feature dialogs, not olddesign modal sizing and form density.

Direct frontend refinements:

- Split Config Center display into three visual variants:
  - env: two-column environment cards;
  - params: dense parameter table with filter chips;
  - database: wide database connection rows.
- Keep feature actions but restyle their placement and hover behavior.
- Align modal widths, labels, field row height and footer buttons to olddesign.

Needs contract:

- Most required CRUD/test contracts already exist.
- Only advanced parameter filtering or database detail fields may require backend confirmation.

Recommended next phase:

- R6G: Config Center per-tab visual variants and modal density polish.

## Cross-Cutting Gaps

### Visual Tokens

Current surfaces use the right general palette: `#f5f6f8`, white cards, `#e5e7eb`, `#2563eb`, dense 13px/14px text. Remaining token gaps:

- Card radius varies between 12px and 16px; olddesign uses many `rounded-2xl` panels but table rows remain tighter.
- Button heights vary across shared Arco and custom buttons.
- Hover actions are not yet standardized.
- Empty states vary per module.

Direct frontend refinements:

- Create a visual token doc for restored workbench surfaces.
- Backfill `shared/ui` defaults only after R6 page-specific polish proves the pattern.

### Component Boundary

Feature-Sliced boundaries were preserved in R0-R4. Remaining cleanup:

- Some visual widgets are now large and should be split after the next polish phase:
  - `CaseAiPanels.vue`
  - `ConfigCenterOverview.vue`
  - `WorkspaceManagementPanel.vue`

Direct frontend refinements:

- Split only when behavior grows, not just for style. Recommended split order:
  - Case AI: generation shell, records shell, config shell.
  - Config Center: nav, stats, env panel, param panel, db panel.

### Contract-Limited Items

Do not visually polish these into "looks complete" before contract is confirmed:

- Case AI generation task flow.
- Case AI records detail/adoption.
- Case AI role config persistence.
- Workspace create/edit/member management.
- Dashboard real metrics.

## Recommended Next Phase Order

1. **R6B Case Management Drawer + Table Action Polish**
   - Highest user-visible value.
   - Mostly frontend with existing case CRUD.
   - Makes Case Center feel much closer to olddesign quickly.

2. **R6G Config Center Per-Tab Visual Variants**
   - Most contracts already exist.
   - Can improve resemblance without backend risk.

3. **R6E AI Connection Modal + Provider Logos**
   - Existing backend contract mostly exists.
   - Brings System Settings closer to `SettingsPage.tsx`.

4. **R6F Workspace Contract + Member Management**
   - Needs contract before real implementation.
   - Visual-only polish should wait.

5. **R6C Case AI Contract + Real Task Flow**
   - Bigger backend/API dependency.
   - Should start only after controller contract is copied or read.

6. **R6A Dashboard Pixel Polish**
   - Useful, but lower priority than operational pages.

## Proposed R6 Target Prompt

Recommended next target:

```text
创建目标：完成 AutoTestHub 前端视觉还原 Phase R6B：用例中心用例管理精修。
基于 docs/frontend-visual-restoration-r5-gap-audit.md 和 olddesign/src/app/components/TestCasePage.tsx，只修改 D:\CodeProject\AutoTestHub，不修改 olddesign/reference/旧项目。范围包括：用例列表列宽/密度/操作列精修、用例新增/编辑从当前弹窗升级为接近旧设计的 480px 右侧 drawer、目录选择/路径展示精修、行操作菜单视觉补齐；保留现有 case CRUD contract，不新增后端 contract，不实现 AI/评审/缺陷/复制等未确认动作。完成 typecheck、lint、build、case-center visual smoke、乱码扫描、中文散落扫描、边界扫描、截图记录和本地 commit。
```

## Verification Snapshot

Latest R5 verification should run:

- `npm.cmd run smoke:dashboard-visual`
- `npm.cmd run smoke:case-center-visual`
- `npm.cmd run smoke:system-settings-visual`
- `npm.cmd run smoke:config-center-visual`
- mojibake scan
- Chinese scatter scan
- light Feature-Sliced boundary scan

The R5 document is audit-only and intentionally does not modify page behavior.
