import { createRequire } from 'node:module';

const require = createRequire('D:/CodeProject/auto/web/package.json');
const { chromium } = require('playwright');

const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5173';
const username = process.env.SMOKE_USERNAME || 'superadmin';
const password = process.env.SMOKE_PASSWORD || 'superadmin123';
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const screenshotPath = `output/playwright/config-center-readonly-${stamp}.png`;

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

try {
  await page.goto(`${baseUrl}/config-center`, { waitUntil: 'networkidle' });

  if (page.url().includes('/login')) {
    await page.getByPlaceholder('请输入账号').fill(username);
    await page.getByPlaceholder('请输入密码').fill(password);
    await page.getByRole('button', { name: '登录' }).click();
  }

  await page.waitForURL('**/config-center', { timeout: 15000 });
  await page.getByText('配置中心总览').waitFor({ timeout: 15000 });
  await page.getByText('环境配置').first().waitFor({ timeout: 15000 });
  await page.getByText('参数集').first().waitFor({ timeout: 15000 });
  await page.getByText('数据库连接').first().waitFor({ timeout: 15000 });
  await page.waitForFunction(() => document.body.textContent?.includes('读取当前空间下的环境配置'));
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const bodyText = await page.locator('body').textContent();
  const settingsRequests = requests.filter((request) => request.url.includes('/api/settings'));
  const hasSettingsEnvs = settingsRequests.some((request) => request.url.includes('/api/settings/envs') && request.status === 200);
  const hasSettingsParams = settingsRequests.some((request) => request.url.includes('/api/settings/params') && request.status === 200);
  const hasSettingsDbConnections = settingsRequests.some(
    (request) => request.url.includes('/api/settings/db-connections') && request.status === 200
  );

  if (!hasSettingsEnvs || !hasSettingsParams || !hasSettingsDbConnections) {
    throw new Error('Config center settings requests did not all return 200');
  }

  console.log(JSON.stringify(
    {
      status: 'pass',
      baseUrl,
      currentUrl: page.url(),
      screenshotPath,
      hasConfigOverview: bodyText?.includes('配置中心总览') || false,
      hasEnvSection: bodyText?.includes('环境配置') || false,
      hasParamSection: bodyText?.includes('参数集') || false,
      hasDbSection: bodyText?.includes('数据库连接') || false,
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
