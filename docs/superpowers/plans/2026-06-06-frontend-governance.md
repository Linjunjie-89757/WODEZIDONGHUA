# Frontend Governance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tighten the frontend 2.0 governance baseline before migrating more business modules.

**Architecture:** Keep the existing Feature-Sliced Lite structure. Add small shared utilities and lint rules that prevent framework leakage and cross-layer imports from spreading.

**Tech Stack:** Vue 3, TypeScript, Vite, Pinia, Vue Router, Arco Design Vue, ESLint.

---

### Task 1: Add Shared Feedback Facade

**Files:**
- Create: `src/shared/lib/feedback.ts`
- Modify: `src/features/auth-login/model/useLogin.ts`
- Modify: `src/features/ai-connection-test/model/useAiConnectionTest.ts`

- [ ] Create `feedback.success`, `feedback.error`, `feedback.warning`, and `feedback.confirm`.
- [ ] Replace direct `Message` usage in feature models.
- [ ] Keep feature modules free from direct Arco message calls.

### Task 2: Add Development Auth Bypass

**Files:**
- Modify: `.env`
- Modify: `.env.example`
- Modify: `env.d.ts`
- Modify: `src/shared/config/env.ts`
- Modify: `src/app/router/guards.ts`

- [ ] Add `VITE_DEV_AUTH_BYPASS=false`.
- [ ] Expose `appEnv.devAuthBypass`, guarded by `import.meta.env.DEV`.
- [ ] Allow protected routes only when the app is running in development and the flag is explicitly true.

### Task 3: Add ESLint Boundary Rules

**Files:**
- Modify: `.eslintrc.cjs`

- [ ] Use `no-restricted-imports` overrides for layer direction.
- [ ] Disallow cross-module deep imports through aliases such as `@features/auth-login/model/useLogin`.
- [ ] Allow internal module code to use relative imports.

### Task 4: Add API Contract Template

**Files:**
- Create: `docs/api-contract.md`

- [ ] Define the contract table format.
- [ ] List the first migration areas: auth, workspace, AI connections, config center, case center, bugs, API automation.
- [ ] State that `shared/api/endpoints.ts` must be generated from verified old frontend/backend paths, not guessed.
