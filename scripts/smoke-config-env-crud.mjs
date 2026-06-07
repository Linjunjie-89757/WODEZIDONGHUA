import { createRequire } from 'node:module';

const require = createRequire('D:/CodeProject/auto/web/package.json');
const { chromium } = require('playwright');

const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5173';
const username = process.env.SMOKE_USERNAME || 'superadmin';
const password = process.env.SMOKE_PASSWORD || 'superadmin123';
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const envName = `smoke-env-${stamp}`;
const editedEnvName = `${envName}-edited`;
const screenshotPath = `output/playwright/config-env-crud-${stamp}.png`;

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

function envCardByName(name) {
  return page.locator('.config-list-item').filter({ hasText: name }).first();
}

async function cleanupSmokeEnvs() {
  await page.waitForSelector('.config-list-item', { timeout: 15000 }).catch(() => undefined);
  await page.waitForTimeout(500);

  const staleCards = page.locator('.config-list-item').filter({ hasText: 'smoke-env-' });

  while ((await staleCards.count()) > 0) {
    const staleName = await staleCards.first().locator('.config-list-item__title').textContent();
    await staleCards.first().getByRole('button', { name: '删除' }).click();
    await page.locator('.arco-modal').filter({ hasText: '删除后无法恢复' }).getByRole('button', { name: '确定' }).click();
    await page.waitForResponse((response) =>
      response.url().includes('/api/settings/envs/') &&
      response.request().method() === 'DELETE' &&
      response.status() === 200
    );
    if (staleName) {
      await page.getByText(staleName).waitFor({ state: 'detached', timeout: 15000 });
    }
    await page.waitForTimeout(300);
  }
}

async function createEnv() {
  await page.getByRole('button', { name: '新增环境' }).click();
  const modal = page.locator('.arco-modal').filter({ hasText: '新增环境配置' }).first();
  await modal.locator('input[placeholder="请输入环境名称"]').fill(envName);
  await modal.locator('input[placeholder="请输入环境类型，例如 API 或 WEB"]').fill('API');
  await modal.locator('input[placeholder="请输入基础地址"]').fill('https://smoke-env.example.com');
  await modal.locator('textarea[placeholder="请输入 JSON 配置，可留空"]').fill('{"source":"smoke"}');
  await page.getByRole('button', { name: '保存' }).click();
  await page.getByText(envName).waitFor({ timeout: 15000 });
}

async function editEnv() {
  const card = envCardByName(envName);
  await card.getByRole('button', { name: '编辑' }).click();
  const modal = page.locator('.arco-modal').filter({ hasText: `编辑环境 ${envName}` }).first();
  await modal.locator('input[placeholder="请输入环境名称"]').fill(editedEnvName);
  await modal.locator('input[placeholder="请输入基础地址"]').fill('https://smoke-env-edited.example.com');
  await page.getByRole('button', { name: '保存' }).click();
  await page.getByText(editedEnvName).waitFor({ timeout: 15000 });
}

async function toggleEnv() {
  const card = envCardByName(editedEnvName);
  await card.getByRole('button', { name: '停用' }).click();
  await card.getByText('停用').waitFor({ timeout: 15000 });
  await card.getByRole('button', { name: '启用' }).click();
  await card.getByText('启用').waitFor({ timeout: 15000 });
}

async function deleteEnv() {
  const card = envCardByName(editedEnvName);
  await card.getByRole('button', { name: '删除' }).click();
  await page.locator('.arco-modal').filter({ hasText: '删除后无法恢复' }).getByRole('button', { name: '确定' }).click();
  await page.getByText(editedEnvName).waitFor({ state: 'detached', timeout: 15000 });
}

try {
  await login();
  await cleanupSmokeEnvs();
  await createEnv();
  await editEnv();
  await toggleEnv();
  await deleteEnv();
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const bodyText = await page.locator('body').textContent();

  console.log(JSON.stringify(
    {
      status: 'pass',
      baseUrl,
      currentUrl: page.url(),
      envName,
      editedEnvName,
      screenshotPath,
      envVisibleAfterDelete: bodyText?.includes(editedEnvName) || false,
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
      envName,
      editedEnvName,
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
