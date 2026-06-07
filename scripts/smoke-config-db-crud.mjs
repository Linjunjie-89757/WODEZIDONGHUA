import { createRequire } from 'node:module';

const require = createRequire('D:/CodeProject/auto/web/package.json');
const { chromium } = require('playwright');

const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5173';
const username = process.env.SMOKE_USERNAME || 'superadmin';
const password = process.env.SMOKE_PASSWORD || 'superadmin123';
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const connectionName = `smoke-db-${stamp}`;
const editedConnectionName = `${connectionName}-edited`;
const screenshotPath = `output/playwright/config-db-crud-${stamp}.png`;

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

function dbCardByName(name) {
  return page.locator('.config-list-item').filter({ hasText: name }).first();
}

async function cleanupSmokeDbConnections() {
  await page.waitForSelector('.config-list-item', { timeout: 15000 }).catch(() => undefined);
  await page.waitForTimeout(500);

  const staleCards = page.locator('.config-list-item').filter({ hasText: 'smoke-db-' });

  while ((await staleCards.count()) > 0) {
    const staleName = await staleCards.first().locator('.config-list-item__title').textContent();
    await staleCards.first().getByRole('button', { name: '删除' }).click();
    await page.locator('.arco-modal').filter({ hasText: '删除后无法恢复' }).getByRole('button', { name: '确定' }).click();
    await page.waitForResponse((response) =>
      response.url().includes('/api/settings/db-connections/') &&
      response.request().method() === 'DELETE' &&
      response.status() === 200
    );
    if (staleName) {
      await page.getByText(staleName).waitFor({ state: 'detached', timeout: 15000 });
    }
    await page.waitForTimeout(300);
  }
}

async function fillDbForm(modal, name, description) {
  await modal.locator('input[placeholder="请输入连接名称"]').fill(name);
  await modal.locator('input[placeholder="请输入数据库类型，例如 MYSQL"]').fill('MYSQL');
  await modal.locator('input[placeholder="请输入 JDBC URL"]').fill('jdbc:mysql://127.0.0.1:65535/smoke');
  await modal.locator('input[placeholder="请输入驱动类名，可留空"]').fill('com.mysql.cj.jdbc.Driver');
  await modal.locator('input[placeholder="请输入用户名，可留空"]').fill('smoke');
  await modal.locator('input[placeholder="新增或修改密码，留空则不保存"]').fill('smoke-password');
  await modal.locator('input[placeholder="请输入连接池最大连接数"]').fill('3');
  await modal.locator('input[placeholder="请输入超时时间，毫秒"]').fill('1000');
  await modal.locator('textarea[placeholder="请输入说明，可留空"]').fill(description);
}

async function createDbConnection() {
  await page.getByRole('button', { name: '新增数据库连接' }).click();
  const modal = page.locator('.arco-modal').filter({ hasText: '新增数据库连接' }).first();
  await fillDbForm(modal, connectionName, 'smoke create');
  await page.getByRole('button', { name: '保存' }).click();
  await page.getByText(connectionName).waitFor({ timeout: 15000 });
}

async function editDbConnection() {
  const card = dbCardByName(connectionName);
  await card.getByRole('button', { name: '编辑' }).click();
  const modal = page.locator('.arco-modal').filter({ hasText: `编辑数据库连接 ${connectionName}` }).first();
  await fillDbForm(modal, editedConnectionName, 'smoke edit');
  await page.getByRole('button', { name: '保存' }).click();
  await page.getByText(editedConnectionName).waitFor({ timeout: 15000 });
}

async function testDbConnection() {
  const card = dbCardByName(editedConnectionName);
  await Promise.all([
    page.waitForResponse((response) =>
      response.url().includes('/api/settings/db-connections/test') &&
      response.request().method() === 'POST' &&
      [200, 400].includes(response.status())
    ),
    card.getByRole('button', { name: '测试' }).click()
  ]);
}

async function toggleDbConnection() {
  const card = dbCardByName(editedConnectionName);
  await card.getByRole('button', { name: '停用' }).click();
  await card.getByText('停用').waitFor({ timeout: 15000 });
  await card.getByRole('button', { name: '启用' }).click();
  await card.getByText('启用').waitFor({ timeout: 15000 });
}

async function deleteDbConnection() {
  const card = dbCardByName(editedConnectionName);
  await card.getByRole('button', { name: '删除' }).click();
  await page.locator('.arco-modal').filter({ hasText: '删除后无法恢复' }).getByRole('button', { name: '确定' }).click();
  await page.getByText(editedConnectionName).waitFor({ state: 'detached', timeout: 15000 });
}

try {
  await login();
  await cleanupSmokeDbConnections();
  await createDbConnection();
  await editDbConnection();
  await testDbConnection();
  await toggleDbConnection();
  await deleteDbConnection();
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const bodyText = await page.locator('body').textContent();

  console.log(JSON.stringify(
    {
      status: 'pass',
      baseUrl,
      currentUrl: page.url(),
      connectionName,
      editedConnectionName,
      screenshotPath,
      connectionVisibleAfterDelete: bodyText?.includes(editedConnectionName) || false,
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
      connectionName,
      editedConnectionName,
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
