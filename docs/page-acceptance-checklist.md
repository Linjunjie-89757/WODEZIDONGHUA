# Page Acceptance Checklist

Run this checklist after each migrated module.

- Build passes with `npm run build`.
- Login and core API smoke path pass against `http://localhost:8080/api`.
- Desktop and mobile screenshots are reviewed.
- No horizontal overflow at 375px, 768px, 1440px.
- Main create, edit, test, delete, and navigation interactions are checked where applicable.
- Page files remain composition-focused; business actions live in `features`, domain models in `entities`, and large regions in `widgets`.
