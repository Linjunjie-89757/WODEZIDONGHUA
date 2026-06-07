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
    screenshotPath: `output/playwright/dashboard-visual-desktop-${stamp}.png`
  },
  {
    name: 'mobile',
    width: 390,
    height: 844,
    screenshotPath: `output/playwright/dashboard-visual-mobile-${stamp}.png`
  }
];

async function login(page) {
  await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'networkidle' });

  if (page.url().includes('/login')) {
    await page.getByPlaceholder('请输入账号').fill(username);
    await page.getByPlaceholder('请输入密码').fill(password);
    await page.getByRole('button', { name: '登录' }).click();
  }

  await page.waitForURL('**/dashboard', { timeout: 15000 });
  await page.getByText('模块入口').waitFor({ timeout: 15000 });
  await page.getByText('最近工作项').waitFor({ timeout: 15000 });
  await page.getByText('还原进度').waitFor({ timeout: 15000 });
}

const browser = await chromium.launch({ headless: true });
const results = [];

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
    await page.screenshot({ path: viewport.screenshotPath, fullPage: true });

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
      screenshotPath: viewport.screenshotPath,
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

  console.log(
    JSON.stringify(
      {
        status: failed ? 'fail' : 'pass',
        baseUrl,
        results
      },
      null,
      2
    )
  );

  if (failed) {
    process.exitCode = 1;
  }
} catch (error) {
  console.log(
    JSON.stringify(
      {
        status: 'fail',
        baseUrl,
        error: error instanceof Error ? error.message : String(error),
        results
      },
      null,
      2
    )
  );
  process.exitCode = 1;
} finally {
  await browser.close();
}
