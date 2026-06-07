# I18n Encoding Cleanup

Date: 2026-06-07

## Scope

This cleanup focuses on `src/shared/i18n/zh-CN.ts`.

The goal is to restore readable Chinese UI copy while keeping the existing i18n key structure stable.

## Rules

- No backend or old frontend files were modified.
- No business logic, API contract, router, component structure, or state management behavior was changed.
- Existing i18n groups and keys were preserved.
- Ambiguous copy was replaced with short, conservative Chinese based on current page context.

## Verification

Commands:

```text
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

Scans:

```text
Scanned zh-CN.ts for common mojibake markers and replacement characters.
```

Result:

- Typecheck: pass.
- Lint: pass.
- Build: pass.
- Mojibake scan: pass.

## Risk

Some labels were restored from surrounding page context rather than an authoritative product glossary. They are intentionally short and generic so later product wording can refine them without changing keys.
