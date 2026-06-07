# Frontend Visual Restoration R4 Config Center Smoke Record

## Scope

R4 focuses on Config Center visual restoration:

- 环境配置
- 参数集
- 数据库连接

## Source Reference

- `D:\CodeProject\AutoTestHub\olddesign\src\app\components\ConfigCenterPage.tsx`

## Changes

- Config Center now uses the olddesign-like second-level shell with a 224px config category rail.
- The right workbench keeps real backend-driven environment, parameter-set and database connection data.
- Existing create/edit/delete/toggle/test feature actions are preserved.
- List rows were restyled to compact olddesign-like cards with status, metadata and hover actions.

## Verification

Latest run:

- `npm.cmd run typecheck`: passed.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed, with the existing Vite large chunk warning.
- `npm.cmd run smoke:config-center-visual`: passed.

Smoke screenshots:

- Desktop env config: `output/playwright/config-center-env-desktop-20260607170653.png`
- Desktop params config: `output/playwright/config-center-param-desktop-20260607170653.png`
- Desktop database config: `output/playwright/config-center-db-desktop-20260607170653.png`
- Mobile env config: `output/playwright/config-center-env-mobile-20260607170653.png`
- Mobile params config: `output/playwright/config-center-param-mobile-20260607170653.png`
- Mobile database config: `output/playwright/config-center-db-mobile-20260607170653.png`

Smoke assertions:

- Login routing reached `/config-center`.
- `配置中心总览` is visible.
- Environment, parameter and database category tabs switch correctly.
- Each category description is visible.
- Horizontal overflow: none on 1440x960 and 390x844.
- Page errors: none.

Console note:

- One 401 resource message appears during auth probing and is recorded by the script, but it does not block this visual smoke.
