import { createRequire } from 'node:module';

const require = createRequire('D:/CodeProject/auto/web/package.json');
const { chromium } = require('playwright');

const baseUrl = 'http://localhost:5173';
const username = 'superadmin';
const password = 'superadmin123';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const requests = [];
const consoleMessages = [];
const pageErrors = [];

page.on('response', async (response) => {
  const url = response.url();
  if (url.includes('/api/auth') || url.includes('/api/workspaces') || url.includes('/api/cases/ai/providers')) {
    requests.push({
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

await page.goto(baseUrl, { waitUntil: 'networkidle' });
const beforeClickText = await page.locator('body').textContent();
const buttonNames = await page.locator('button').evaluateAll((buttons) =>
  buttons.map((button) => button.textContent?.trim())
);
await page.getByPlaceholder('请输入账号').fill(username);
await page.getByPlaceholder('请输入密码').fill(password);
await page.getByRole('button', { name: '登录' }).click();
await page.waitForTimeout(3000);
await page.waitForURL('**/system-settings/ai-connections', { timeout: 15000 }).catch(() => undefined);
await page.waitForLoadState('networkidle').catch(() => undefined);

if (page.url().includes('/system-settings/ai-connections')) {
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForURL('**/system-settings/ai-connections', { timeout: 15000 }).catch(() => undefined);
}

const bodyText = await page.locator('body').textContent();
const pageTitle = await page.getByText('系统设置').first().textContent({ timeout: 3000 }).catch(() => null);
const workspaceText = await page.locator('.workspace-switcher').textContent({ timeout: 3000 }).catch(() => null);
const aiSectionText = await page.getByText('AI 连接池').first().textContent({ timeout: 3000 }).catch(() => null);
const hasFallbackText = (await page.getByText('OpenAI 默认连接').count()) > 0 || (await page.getByText('本地 Ollama').count()) > 0;

await page.screenshot({ path: 'output/playwright/auth-workspace-ai-smoke.png', fullPage: true });
await browser.close();

console.log(JSON.stringify(
  {
    pageTitle,
    currentUrl: page.url(),
    workspaceText,
    aiSectionText,
    hasFallbackText,
    beforeClickText: beforeClickText?.slice(0, 1000),
    buttonNames,
    bodyText: bodyText?.slice(0, 1000),
    consoleMessages,
    pageErrors,
    requests
  },
  null,
  2
));
