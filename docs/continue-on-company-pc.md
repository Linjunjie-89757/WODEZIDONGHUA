# AutoTestHub Continuation Handoff

## Repository

- Project path on current machine: `D:\CodeProject\AutoTestHub`
- Git remote: `https://github.com/Linjunjie-89757/WODEZIDONGHUA.git`
- Backend target: `http://localhost:8080/api`
- Frontend stack: Vue 3, TypeScript, Vite, Pinia, Vue Router, Arco Design Vue, Feature-Sliced Lite

## What Has Been Done

- Frontend 2.0 has been rebuilt in parallel with the old system.
- Core governance is in place: Feature-Sliced Lite layering, shared API/request, i18n, feedback wrapper and smoke documentation.
- Sample migrated modules include:
  - Config Center: environment config, parameter sets, database connections.
  - Case Center: case management, AI generation shell, AI generation records shell, AI config shell.
  - System Settings: AI connections and workspace management visuals.
  - Bug Management samples.
  - API Automation phases including readonly, CRUD/debug, assertions, processors, cases, scenarios, advanced controllers and multiple visual alignment phases.
- Visual restoration has started from `olddesign/` and old project references.

## Latest Completed Phase

Phase R6B: Case Center case management polish.

Completed:

- Case list visual polish: column order, widths, row height, header density, status badge, priority badge and sticky action column.
- Create/edit case UI changed from dialog to a 480px right-side drawer.
- Directory/path display refined in the drawer.
- Row action menu visually aligned with olddesign.
- Existing case CRUD contract was preserved.
- Smoke updated and documented.

Latest commit before this handoff:

- `814f7c0 feat: polish case management visuals`

Smoke record:

- `docs/smoke/2026-06-08-frontend-visual-restoration-r6b-case-management-polish.md`

Important limitation:

- Directory selection in the drawer is currently visual/path-display only. It does not mutate `directoryId` because no new backend contract was added.
- Execute/review/create bug/copy actions are visual or disabled only.

## Reference Assets Now Included

- `olddesign/`: Figma/Make exported old design code.
- `reference/`: copied old project reference files.

These are intended as read-only visual and structural references for future phases.

## Commands Used Regularly

Install:

```powershell
npm install
```

Dev:

```powershell
npm.cmd run dev
```

Verification:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run smoke:case-center-visual
```

Scans:

```powershell
Select-String -Path src\**\*.ts,src\**\*.vue,scripts\*.mjs -Pattern '�|Ã|Â|鍦|璇|鎺|楠|绛'
Select-String -Path src\**\*.vue -Pattern '[\u4e00-\u9fff]'
Select-String -Path src\widgets\**\*.vue,src\widgets\**\*.ts,src\features\**\*.vue,src\entities\**\*.ts -Pattern '@pages|@widgets|@features'
```

## Suggested Next Step

Recommended next phase:

R6C: Case AI controller contract补读 and AI case generation real task flow.

Reason:

- Case AI generation is currently a visual shell.
- Before continuing visual polish, the frontend should confirm the old frontend/backend task contract for generation, records, adoption and retry/cancel actions.

Alternative if the priority is pure visual fidelity:

- R6A: main shell/dashboard pixel polish against olddesign screenshots.
- R6D: system settings AI connection/provider modal visual polish.

## How To Continue In A New Codex Conversation

Paste this instruction:

```text
请继续 D:\CodeProject\AutoTestHub。先阅读 docs/continue-on-company-pc.md 和 docs/frontend-visual-restoration-r5-gap-audit.md，再检查 git status。保持 Feature-Sliced Lite 边界，只修改 AutoTestHub，不修改 olddesign/reference。下一步按 R6C：Case AI controller contract 补读 + AI 用例生成真实任务流推进；先读 olddesign 和 reference，不猜接口，完成 typecheck/lint/build/smoke/扫描并提交本地 commit。
```
