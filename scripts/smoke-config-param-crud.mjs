import { createRequire } from 'node:module';

const require = createRequire('D:/CodeProject/auto/web/package.json');
const { chromium } = require('playwright');

const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5173';
const username = process.env.SMOKE_USERNAME || 'superadmin';
const password = process.env.SMOKE_PASSWORD || 'superadmin123';
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const paramName = `smoke-param-${stamp}`;
const editedParamName = `${paramName}-edited`;
const screenshotPath = `output/playwright/config-param-crud-${stamp}.png`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const requests = [];
const consoleMessages = [];
const pageErrors = [];

page.on('response', (response) => {
  const url = response.url();

  if (url.includes('/api/auth') || url.includes('/api/workspaces') || url.includes('/api/settings')) {
    requests.push({
      method: response.request().method(),
      url,
      status: response.status()
    });
  }
});
page.on('console', (message) => {
  consoleMessages.push({
    type: message.type(),
    text: message.text()
  });
});
page.on('pageerror', (error) => {
  pageErrors.push(error.message);
});

async function login() {
  await page.goto(`${baseUrl}/config-center`, { waitUntil: 'networkidle' });

  if (page.url().includes('/login')) {
    await page.getByPlaceholder('请输入账号').fill(username);
    await page.getByPlaceholder('请输入密码').fill(password);
    await page.getByRole('button', { name: '登录' }).click();
  }

  await page.waitForURL('**/config-center', { timeout: 15000 });
  await page.getByText('配置中心总览').waitFor({ timeout: 15000 });
}

function paramCardByName(name) {
  return page.locator('.config-list-item').filter({ hasText: name }).first();
}

async function cleanupSmokeParams() {
  await page.waitForSelector('.config-list-item', { timeout: 15000 }).catch(() => undefined);
  await page.waitForTimeout(500);

  const staleCards = page.locator('.config-list-item').filter({ hasText: 'smoke-param-' });

  while ((await staleCards.count()) > 0) {
    const staleName = await staleCards.first().locator('.config-list-item__title').textContent();
    await staleCards.first().getByRole('button', { name: '删除' }).click();
    await page.locator('.arco-modal').filter({ hasText: '删除后无法恢复' }).getByRole('button', { name: '确定' }).click();
    await page.waitForResponse((response) =>
      response.url().includes('/api/settings/params/') &&
      response.request().method() === 'DELETE' &&
      response.status() === 200
    );
    if (staleName) {
      await page.getByText(staleName).waitFor({ state: 'detached', timeout: 15000 });
    }
    await page.waitForTimeout(300);
  }
}

async function createParam() {
  await page.getByRole('button', { name: '新增参数集' }).click();
  const modal = page.locator('.arco-modal').filter({ hasText: '新增参数集' }).first();
  await modal.locator('input[placeholder="请输入参数名称"]').fill(paramName);
  await modal.locator('input[placeholder="请输入参数类型，例如 HEADER 或 TOKEN"]').fill('HEADER');
  await modal.locator('textarea[placeholder="请输入 JSON 参数内容，可留空"]').fill('{"X-Smoke":"true"}');
  await page.getByRole('button', { name: '保存' }).click();
  await page.getByText(paramName).waitFor({ timeout: 15000 });
}

async function editParam() {
  const card = paramCardByName(paramName);
  await card.getByRole('button', { name: '编辑' }).click();
  const modal = page.locator('.arco-modal').filter({ hasText: `编辑参数集 ${paramName}` }).first();
  await modal.locator('input[placeholder="请输入参数名称"]').fill(editedParamName);
  await modal.locator('textarea[placeholder="请输入 JSON 参数内容，可留空"]').fill('{"X-Smoke":"edited"}');
  await page.getByRole('button', { name: '保存' }).click();
  await page.getByText(editedParamName).waitFor({ timeout: 15000 });
}

async function toggleParam() {
  const card = paramCardByName(editedParamName);
  await card.getByRole('button', { name: '停用' }).click();
  await card.getByText('停用').waitFor({ timeout: 15000 });
  await card.getByRole('button', { name: '启用' }).click();
  await card.getByText('启用').waitFor({ timeout: 15000 });
}

async function deleteParam() {
  const card = paramCardByName(editedParamName);
  await card.getByRole('button', { name: '删除' }).click();
  await page.locator('.arco-modal').filter({ hasText: '删除后无法恢复' }).getByRole('button', { name: '确定' }).click();
  await page.getByText(editedParamName).waitFor({ state: 'detached', timeout: 15000 });
}

try {
  await login();
  await cleanupSmokeParams();
  await createParam();
  await editParam();
  await toggleParam();
  await deleteParam();
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const bodyText = await page.locator('body').textContent();

  console.log(JSON.stringify(
    {
      status: 'pass',
      baseUrl,
      currentUrl: page.url(),
      paramName,
      editedParamName,
      screenshotPath,
      paramVisibleAfterDelete: bodyText?.includes(editedParamName) || false,
      consoleMessages,
      pageErrors,
      requests
    },
    null,
    2
  ));
} catch (error) {
  await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => undefined);
  console.log(JSON.stringify(
    {
      status: 'fail',
      baseUrl,
      currentUrl: page.url(),
      paramName,
      editedParamName,
      screenshotPath,
      error: error instanceof Error ? error.message : String(error),
      consoleMessages,
      pageErrors,
      requests
    },
    null,
    2
  ));
  process.exitCode = 1;
} finally {
  await browser.close();
}
