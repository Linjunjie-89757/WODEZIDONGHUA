# Olddesign Visual Source Audit

## Purpose

`D:\CodeProject\AutoTestHub\olddesign` is the Figma Make export and should be treated as the visual source layer for future reproduction work. It is more useful than screenshots alone because it contains concrete layout dimensions, Tailwind utility decisions, component variants and page composition.

Use this document before each visual reproduction phase. The rule is:

1. Use `olddesign` to extract visual token and layout intent.
2. Use the old running frontend screenshots to verify real runtime appearance.
3. Use old project source/backend contract only for behavior and data shape.
4. Implement in AutoTestHub with Vue 3 + Arco + Feature-Sliced Lite, without copying old stores or changing backend contracts.

## Source Files

| Source | Role |
| --- | --- |
| `olddesign/default_shadcn_theme.css` | Base token source from shadcn/Figma export. |
| `olddesign/src/app/App.tsx` | Main shell: sidebar, top bar, workspace switcher, user block. |
| `olddesign/src/app/components/ApiTestPage.tsx` | API automation request editor and main tabs. |
| `olddesign/src/app/components/ScenarioPage.tsx` | Scenario workbench, step rows, right property panel. |
| `olddesign/src/app/components/ConfigCenterPage.tsx` | Config center density and local settings pages. |
| `olddesign/src/app/components/ui/*` | Button, table, tabs, drawer, dialog, input component style references. |
| `http://localhost:4173` | Runtime old frontend screenshot target. |
| `reference/old-auto` | Old source behavior and contract reference. |

## Base Tokens

From `default_shadcn_theme.css`:

| Token | Source Value | AutoTestHub Target |
| --- | --- | --- |
| base font size | `16px` | Keep `14px` to `16px` contextually; dense app surfaces mostly `13px`/`14px`. |
| background | `#ffffff` plus page `bg-gray-50` | App content background should be `#f5f6f8` / gray-50 family. |
| foreground | near black `#030213` / `oklch(0.145 0 0)` | Main text `#111827` / `#0f172a`. |
| muted | `#ececf0` | Segmented tabs and empty areas use `#f3f4f6` / `#f1f3f6`. |
| muted foreground | `#717182` | Secondary text `#64748b` / `#6b7280`. |
| border | `rgba(0, 0, 0, 0.1)` | Standard border `#e5e7eb`; softer border `#edf0f5`. |
| radius | `0.625rem` | Standard radius 8px to 10px; larger panels 12px to 16px. |
| primary | `#030213` in shadcn, but pages use blue actions | Product action blue should be `#2563eb` / `#3b82f6`. |

Important: the Figma export's shadcn `primary` is nearly black, but page implementation uses blue for actual product actions. For AutoTestHub visual reproduction, use the page-level blue action language, not raw shadcn primary.

## Main Shell Rules

From `App.tsx`:

- Root shell is `flex bg-gray-50`.
- Sidebar:
  - expanded width `w-60` = 240px;
  - collapsed width `w-[60px]`, but AutoTestHub does not need collapse until explicitly scoped;
  - background `bg-slate-900`;
  - logo/top row height `h-14` = 56px;
  - border `border-slate-800`;
  - nav vertical padding `px-2 py-3`;
  - nav item padding `px-2 py-2.5`, radius `rounded-lg`, text `text-sm`;
  - active nav `bg-blue-500 text-white font-medium`;
  - inactive nav `text-slate-400 hover:bg-slate-800 hover:text-slate-100`;
  - divider before config center: `my-2 border-t border-slate-700/60`;
  - bottom user block has border top and compact avatar row.
- Top header:
  - height `h-14` = 56px;
  - background white;
  - border bottom `border-gray-200`;
  - horizontal padding `px-6`;
  - page title `text-base font-semibold text-gray-900`;
  - workspace switcher button `px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50`;
  - right user area uses notification icon, avatar, username.

AutoTestHub S0 already follows this closely. Future shell refinements should compare against `App.tsx` first, then screenshot.

## Shared Component Rules

From `ui/button.tsx`:

- Base button: inline-flex, center aligned, gap 8px, no wrap, text-sm, font-medium, rounded-md, transition-all.
- Default size: `h-9 px-4 py-2`.
- Small size: `h-8 px-3`.
- Icon size: `size-9`.
- Disabled: pointer-events none and opacity 50%.

AutoTestHub mapping:

- `AppButton` primary should visually map to `h-9`, radius 8px, `#2563eb` fill where product pages use blue.
- Text/ghost buttons should avoid heavy borders and use muted hover backgrounds.

From `ui/table.tsx`:

- Table container is horizontally scrollable when needed.
- Table text is `text-sm`.
- Header height is `h-10`; cell padding is `p-2`.
- Rows use `border-b` and hover `bg-muted/50`.

AutoTestHub mapping:

- Dense tables should use 40px header, 40px to 48px rows, 8px horizontal cell padding.
- Avoid card-heavy list rows where olddesign uses table density.

From `ui/tabs.tsx`:

- Segmented tabs list uses `bg-muted`, `h-9`, rounded-xl, small padding.
- Trigger uses active card background, text-sm, font-medium, rounded-xl.

AutoTestHub mapping:

- Main workbench segmented tabs should be 36px high inside a 48px strip.
- Editor document tabs should be 36px to 40px high, border bottom active state, not large card tabs.

## API Automation Request Editor Rules

From `ApiTestPage.tsx`:

- Main page is `size-full flex flex-col bg-gray-50`.
- Top module tabs:
  - white strip, height `h-12` = 48px;
  - horizontal padding `px-6`;
  - segmented group `bg-gray-100 rounded-lg p-1 gap-0.5`.
- Left tree:
  - workspace/module tree uses `py-1.5`, radius 8px, text-sm;
  - level indentation is `level * 14 + 8`.
- Request editor:
  - request tabs are document-like tabs, active bottom border blue;
  - method colors:
    - GET text green;
    - POST blue/orange depending context;
    - PUT orange;
    - DELETE red;
    - PATCH purple.
- Body type selector is lightweight pill style, not a heavy form card.
- Import modal uses rounded-2xl, border-gray-200, shadow-lg/2xl, 520px width.

Implementation note:

- AutoTestHub request editor should continue using existing API definition contract.
- Use olddesign for layout/spacing only.
- Do not implement import/curl/AI just because olddesign contains import UI unless a phase explicitly asks for it.

## Scenario Workbench Rules

From `ScenarioPage.tsx`:

### Overall Layout

- Scenario module content is `flex-1 flex overflow-hidden min-w-0`.
- Left rail:
  - width `w-64` = 256px;
  - background white;
  - right border `border-gray-200`;
  - create button area `px-4 pt-4 pb-3`;
  - create button `py-2 bg-blue-600 text-white rounded-lg text-sm font-medium`;
  - search area `px-4 pb-3`;
  - search input `pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm`;
  - tree area `flex-1 overflow-y-auto px-3`.
- Main editor:
  - scenario tab strip height `h-9` to `h-10`;
  - active scenario tab `bg-white text-gray-800 border-b-2 border-b-blue-500`;
  - inactive scenario tab `bg-gray-50 text-gray-500 hover:bg-gray-100`;
  - tab add/more buttons `w-8 h-9`.
- Editor body:
  - `flex-1 flex overflow-hidden bg-white gap-5`;
  - center content plus right panel.
- Right property panel:
  - width `w-72` = 288px;
  - outer padding `p-3`;
  - inner card `bg-gray-50 rounded-2xl border border-gray-200 shadow-sm`;
  - header padding `px-4 pt-4 pb-3`;
  - body `px-4 py-4 space-y-5`;
  - fields are label `text-xs text-gray-500`, input `px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm`;
  - actions: execute blue button first, save outline second.

### Scenario Tree

- Tree row:
  - `py-1.5`, radius 8px, text-sm;
  - indentation `level * 14 + 8`;
  - chevron `w-3.5 h-3.5`;
  - folder `w-4 h-4`;
  - workspace label `text-gray-800 font-medium`;
  - count badge `text-xs text-gray-400 bg-gray-100 rounded px-1.5 py-0.5`;
  - actions are hidden until hover.

### Step Row

- Step row:
  - `group flex items-center gap-3 px-4 py-3`;
  - border bottom `border-gray-100`;
  - hover `bg-blue-50/30`;
  - drag handle `w-4 h-4 text-gray-300`;
  - index chip `w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs`;
  - enabled switch `w-8 h-4 bg-blue-500`, knob `w-3 h-3`;
  - run circle `w-5 h-5 rounded-full bg-blue-500`;
  - step kind chip `px-2 py-0.5 bg-blue-50 text-blue-500 border border-blue-300 text-xs rounded`;
  - method badge `px-2 py-0.5 rounded text-xs font-semibold border`;
  - name `text-sm text-gray-800 font-medium w-28 truncate`;
  - url `text-xs text-gray-400 font-mono flex-1 truncate`;
  - status `text-xs` with green/red/gray state.

This step row should be the primary target for S2 because current AutoTestHub rows are structurally functional but not yet olddesign-faithful.

## Recommended Migration Method

For each future visual phase:

1. Capture target screenshot from old frontend.
2. Capture current AutoTestHub screenshot.
3. Read matching `olddesign` component and list exact dimensions/classes.
4. Implement only the scoped screen using AutoTestHub entities/features/widgets.
5. Run screenshot after and horizontal overflow check.
6. Record remaining deltas in `docs/smoke`.

Do not:

- copy React state/store logic into Vue;
- introduce shadcn or React dependencies into AutoTestHub;
- change backend payload shape because olddesign has mock structures;
- chase pixel perfection before matching the page composition, widths and row density.

## Suggested Next Phases

1. **Phase S2: Scenario Step Editor Code-Level Reproduction**
   - Use `ScenarioPage.tsx` step row as mother layout.
   - Rebuild step row density, chips, enable switch, run circle, method badge, hover actions.
   - Add old-like right property field order and delete action placement if existing feature boundaries allow it.

2. **Phase S3: API Request Editor Code-Level Reproduction**
   - Use `ApiTestPage.tsx`.
   - Align main tabs, document tabs, method/path command row, body type pills, params table density.

3. **Phase S4: Config Center / Settings Surface Alignment**
   - Use `ConfigCenterPage.tsx` and `SettingsPage.tsx`.
   - Align list density, side nav, detail card and modal/drawer surfaces.

4. **Phase S5: Shared UI Token Consolidation**
   - Backfill `shared/styles/tokens.css` and `shared/ui` defaults from the proven screen work.
   - Avoid premature token changes that could disturb pages not yet audited.
