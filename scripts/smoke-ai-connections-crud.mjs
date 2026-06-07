import { createRequire } from 'node:module';

const require = createRequire('D:/CodeProject/auto/web/package.json');
const { chromium } = require('playwright');

const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5173';
const username = process.env.SMOKE_USERNAME || 'superadmin';
const password = process.env.SMOKE_PASSWORD || 'superadmin123';
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const connectionName = `smoke-crud-${stamp}`;
const editedConnectionName = `${connectionName}-edited`;
const screenshotPath = `output/playwright/ai-connections-crud-${stamp}.png`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const requests = [];
const consoleMessages = [];
const pageErrors = [];

page.on('response', (response) => {
  const url = response.url();

  if (url.includes('/api/auth') || url.includes('/api/workspaces') || url.includes('/api/cases/ai/providers')) {
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
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  if (page.url().includes('/login')) {
    await page.getByPlaceholder('请输入账号').fill(username);
    await page.getByPlaceholder('请输入密码').fill(password);
    await page.getByRole('button', { name: '登录' }).click();
  }

  await page.waitForURL('**/system-settings/ai-connections', { timeout: 15000 });
  await page.waitForLoadState('networkidle').catch(() => undefined);
}

async function createConnection() {
  await page.getByRole('button', { name: '新增连接' }).click();
  const modal = page.locator('.arco-modal').filter({ hasText: '新增 AI 连接' }).first();
  await modal.locator('input[placeholder="请输入连接名称"]').fill(connectionName);
  await modal.locator('input[placeholder="请输入基础地址"]').fill('https://api.openai.com/v1');
  await modal.locator('input[placeholder="请输入默认模型"]').fill('gpt-4o-mini');
  await modal.locator('input[placeholder="请输入 API Key"]').fill(`sk-smoke-${stamp}`);
  await modal.locator('input').nth(4).fill('30');
  await page.getByRole('button', { name: '保存' }).click();
  await page.getByText(connectionName).waitFor({ timeout: 15000 });
}

async function cleanupSmokeConnections() {
  await page.waitForSelector('.ai-connection-card', { timeout: 15000 }).catch(() => undefined);
  await page.waitForTimeout(500);

  const staleCards = page.locator('.ai-connection-card').filter({ hasText: 'smoke-crud-' });

  while ((await staleCards.count()) > 0) {
    const staleCard = staleCards.first();
    const staleName = await staleCard.locator('.ai-connection-card__name').textContent();
    await staleCard.getByRole('button', { name: '删除' }).click();
    await page.locator('.arco-modal').filter({ hasText: '删除后无法恢复' }).getByRole('button', { name: '确定' }).click();
    await page.waitForResponse((response) =>
      response.url().includes('/api/cases/ai/providers') &&
      response.request().method() === 'DELETE' &&
      response.status() === 200
    );
    if (staleName) {
      await page.getByText(staleName).waitFor({ state: 'detached', timeout: 15000 });
    }
    await page.waitForTimeout(300);
  }
}

async function editConnection() {
  const card = page.locator('.ai-connection-card').filter({ hasText: connectionName }).first();
  await card.getByRole('button', { name: '编辑' }).click();
  const modal = page.locator('.arco-modal').filter({ hasText: `编辑 ${connectionName}` }).first();
  await modal.locator('input[placeholder="请输入连接名称"]').fill(editedConnectionName);
  await page.getByRole('button', { name: '保存' }).click();
  await page.getByText(editedConnectionName).waitFor({ timeout: 15000 });
}

async function deleteConnection() {
  const card = page.locator('.ai-connection-card').filter({ hasText: editedConnectionName }).first();
  await card.getByRole('button', { name: '删除' }).click();
  await page.locator('.arco-modal').filter({ hasText: '删除后无法恢复' }).getByRole('button', { name: '确定' }).click();
  await page.getByText(editedConnectionName).waitFor({ state: 'detached', timeout: 15000 });
}

try {
  await login();
  await cleanupSmokeConnections();
  await createConnection();
  await editConnection();
  await deleteConnection();
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const finalBodyText = await page.locator('body').textContent();

  console.log(JSON.stringify(
    {
      status: 'pass',
      baseUrl,
      currentUrl: page.url(),
      connectionName,
      editedConnectionName,
      screenshotPath,
      createdVisibleAfterDelete: finalBodyText?.includes(editedConnectionName) || false,
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
