# 2026-06-06 Auth + Workspace + AI Connections Smoke

## Scope

- New frontend: `D:\CodeProject\AutoTestHub`
- Old backend: `D:\CodeProject\auto\server`
- Backend base URL: `http://localhost:8080/api`
- Frontend URL: `http://localhost:5173`

## Environment

- MySQL container: `auto-platform-mysql`
- MySQL port mapping: `127.0.0.1:3307 -> 3306`
- Login account: `superadmin`
- Login password: `superadmin123`

## Checks

| Check | Status | Notes |
| --- | --- | --- |
| Backend database reachable | Pass | Docker MySQL reported healthy. |
| Backend build through `run-local-server.cmd` | Blocked | `-DskipTests` still compiles tests; `AiProviderClientTests` does not match the current `AiProviderRequestProfile` constructor. |
| Login from new frontend | Pass | User reported login succeeded. |
| Session restore through `/auth/me` | Pass | Browser smoke refresh stayed on `/system-settings/ai-connections`; post-login `/auth/me` returned 200. |
| Workspace list through `/workspaces/switchable` | Pass | Browser smoke loaded switchable workspaces and showed workspace options. |
| AI provider list through `/cases/ai/providers` | Pass | Browser smoke loaded real provider data; demo fallback text was absent. |

## Fix Applied During Smoke

- Removed demo fallback data from `widgets/ai-connection-pool`.
- Added explicit AI connection error state and empty state.
- Added retry action for failed AI connection loading.
- Changed login button to call login action directly so the smoke reliably submits credentials.

## Browser Smoke Evidence

- Screenshot: `output/playwright/auth-workspace-ai-smoke.png`
- Requests observed:
  - `GET /api/auth/me`: 401 before login, 200 after login refresh.
  - `POST /api/auth/login`: 200.
  - `GET /api/workspaces/switchable`: 200.
  - `GET /api/cases/ai/providers`: 200.
- Real AI provider data was rendered: `deepseek`.
- Demo fallback text was not present.

## Follow-Up

- Capture desktop and mobile screenshots for the AI connection page.
- Fix old backend test constructor calls in `AiProviderClientTests` in source control if the local manual edit has not been committed.
