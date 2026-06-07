# API Automation Phase 5-7 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete AutoTestHub API Automation Phase 5 processors, Phase 6 API cases, and Phase 7 scenario orchestration without expanding into AI generation.

**Architecture:** Keep API Automation domain contracts in `entities/api-automation`, compose page-level areas in `widgets/api-automation-shell`, and keep create/edit/run/delete actions in feature folders. Reuse existing definition CRUD/debug and Config Center DB connection APIs instead of introducing duplicate service calls.

**Tech Stack:** Vue 3, TypeScript, Vite, Pinia, Vue Router, Arco Design Vue, Feature-Sliced Lite.

---

### Task 1: Domain Contract

**Files:**
- Modify: `src/entities/api-automation/model/types.ts`
- Modify: `src/entities/api-automation/api/apiAutomationApi.ts`
- Modify: `src/entities/api-automation/lib/requestConfig.ts`
- Modify: `src/entities/api-automation/index.ts`

- [ ] Add processor config/result types for script, SQL, wait, and extract processors.
- [ ] Type definition `preProcessors`, `postProcessors`, `processorResults`, and `extractionResults`.
- [ ] Add API case types, save payloads, run history, and change history types.
- [ ] Add scenario types, save payloads, modules, steps, and run result types.
- [ ] Add API wrappers for cases, case history, scenario modules, scenarios, scenario run, and report steps.

### Task 2: Phase 5 Processors

**Files:**
- Create: `src/features/api-definition-processors/*`
- Modify: `src/features/api-definition-save/ui/ApiDefinitionDialog.vue`
- Modify: `src/features/api-definition-debug/ui/ApiDefinitionDebugPanel.vue`
- Modify: `src/shared/i18n/zh-CN.ts`
- Add: `docs/smoke/2026-06-07-api-automation-phase5-processors.md`

- [ ] Create a compact processor editor with pre/post stage support.
- [ ] Support script, SQL, wait, and extract processor fields.
- [ ] Reuse `configCenterApi.listDbConnections` for SQL DB selection.
- [ ] Persist processors through definition create/update payloads.
- [ ] Display processor and extraction results after debug execution.
- [ ] Record smoke coverage and run lint/build/encoding scan.

### Task 3: Phase 6 API Cases

**Files:**
- Create: `src/features/api-case-save/*`
- Create: `src/features/api-case-delete/*`
- Create: `src/features/api-case-run/*`
- Create: `src/widgets/api-case-management/*`
- Modify: `src/widgets/api-automation-shell/ui/ApiAutomationShell.vue`
- Modify: `src/shared/i18n/zh-CN.ts`
- Add: `docs/smoke/2026-06-07-api-automation-phase6-cases.md`

- [ ] Add case list filtered by selected definition.
- [ ] Add create/edit/delete case dialog.
- [ ] Add case detail drawer with request snapshot summary.
- [ ] Add case run action and run result display.
- [ ] Add run history and change history views.
- [ ] Record smoke coverage and run lint/build/encoding scan.

### Task 4: Phase 7 Scenarios

**Files:**
- Create: `src/features/api-scenario-save/*`
- Create: `src/features/api-scenario-delete/*`
- Create: `src/features/api-scenario-run/*`
- Create: `src/widgets/api-scenario-management/*`
- Modify: `src/widgets/api-automation-shell/ui/ApiAutomationShell.vue`
- Modify: `src/shared/i18n/zh-CN.ts`
- Add: `docs/smoke/2026-06-07-api-automation-phase7-scenarios.md`

- [ ] Add scenario list and module loading.
- [ ] Add create/edit/delete scenario dialog.
- [ ] Add step tree editor for referenced definition, referenced case, custom request, and nested display.
- [ ] Add scenario run action and result display.
- [ ] Record smoke coverage and run lint/build/encoding scan.

### Task 5: Final Closeout

**Files:**
- Modify or add smoke scripts if the local services are available.

- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
- [ ] Run docs/scripts mojibake scan.
- [ ] Run source Chinese string scan outside `src/shared/i18n/zh-CN.ts`.
- [ ] Confirm no API AI generation implementation was added.
- [ ] Mark the active goal complete only after the evidence is fresh.
