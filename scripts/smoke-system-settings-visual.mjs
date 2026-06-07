import { createRequire } from 'node:module';

const require = createRequire('D:/CodeProject/auto/web/package.json');
const { chromium } = require('playwright');

const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5173';
const username = process.env.SMOKE_USERNAME || 'superadmin';
const password = process.env.SMOKE_PASSWORD || 'superadmin123';
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);

const viewports = [
  {
    name: 'desktop',
    width: 1440,
    height: 960,
    aiScreenshotPath: `output/playwright/system-settings-ai-desktop-${stamp}.png`,
    workspaceScreenshotPath: `output/playwright/system-settings-workspace-desktop-${stamp}.png`
  },
  {
    name: 'mobile',
    width: 390,
    height: 844,
    aiScreenshotPath: `output/playwright/system-settings-ai-mobile-${stamp}.png`,
    workspaceScreenshotPath: `output/playwright/system-settings-workspace-mobile-${stamp}.png`
  }
];

const browser = await chromium.launch({ headless: true });
const results = [];

async function login(page) {
  await page.goto(`${baseUrl}/system-settings/ai-connections`, { waitUntil: 'networkidle' });

  if (page.url().includes('/login')) {
    await page.getByPlaceholder('请输入账号').fill(username);
    await page.getByPlaceholder('请输入密码').fill(password);
    await page.getByRole('button', { name: '登录' }).click();
  }

  await page.waitForURL('**/system-settings/ai-connections', { timeout: 15000 });
  await page.getByRole('button', { name: 'AI 连接' }).waitFor({ timeout: 15000 });
  await page.getByText('AI 连接池').waitFor({ timeout: 15000 });
  await page.getByText('支持的供应商').waitFor({ timeout: 15000 });
}

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({
      viewport: {
        width: viewport.width,
        height: viewport.height
      }
    });

    const pageErrors = [];
    const consoleErrors = [];

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    await login(page);
    await page.screenshot({ path: viewport.aiScreenshotPath, fullPage: true });

    await page.getByRole('button', { name: '空间管理' }).click();
    await page.getByText('工作空间配置').waitFor({ timeout: 15000 });
    await page.getByText('空间总数').waitFor({ timeout: 15000 });
    await page.screenshot({ path: viewport.workspaceScreenshotPath, fullPage: true });

    const layout = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyClientWidth: document.body.clientWidth,
      bodyScrollWidth: document.body.scrollWidth
    }));

    results.push({
      name: viewport.name,
      width: viewport.width,
      height: viewport.height,
      aiScreenshotPath: viewport.aiScreenshotPath,
      workspaceScreenshotPath: viewport.workspaceScreenshotPath,
      hasHorizontalOverflow:
        layout.scrollWidth > layout.clientWidth || layout.bodyScrollWidth > layout.bodyClientWidth,
      layout,
      pageErrors,
      consoleErrors
    });

    await page.close();
  }

  const failed = results.some(
    (result) => result.hasHorizontalOverflow || result.pageErrors.length > 0
  );

  console.log(JSON.stringify(
    {
      status: failed ? 'fail' : 'pass',
      baseUrl,
      results
    },
    null,
    2
  ));

  if (failed) {
    process.exitCode = 1;
  }
} catch (error) {
  console.log(JSON.stringify(
    {
      status: 'fail',
      baseUrl,
      error: error instanceof Error ? error.message : String(error),
      results
    },
    null,
    2
  ));
  process.exitCode = 1;
} finally {
  await browser.close();
}
