import { createRequire } from 'node:module';

const require = createRequire('D:/CodeProject/auto/web/package.json');
const { chromium } = require('playwright');

const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5173';
const username = process.env.SMOKE_USERNAME || 'superadmin';
const password = process.env.SMOKE_PASSWORD || 'superadmin123';
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const screenshotPath = `output/playwright/bug-management-readonly-${stamp}.png`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const requests = [];
const consoleMessages = [];
const pageErrors = [];

page.on('response', (response) => {
  const url = response.url();

  if (url.includes('/api/auth') || url.includes('/api/workspaces') || url.includes('/api/bugs')) {
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
  await page.goto(`${baseUrl}/bug-management`, { waitUntil: 'networkidle' });

  if (page.url().includes('/login')) {
    await page.getByPlaceholder('请输入账号').fill(username);
    await page.getByPlaceholder('请输入密码').fill(password);
    await page.getByRole('button', { name: '登录' }).click();
  }

  await page.waitForURL('**/bug-management', { timeout: 15000 });
}

try {
  await login();
  await page.getByRole('heading', { name: '缺陷管理总览' }).waitFor({ timeout: 15000 });
  await page.getByRole('heading', { name: '缺陷列表' }).waitFor({ timeout: 15000 });

  const firstBug = page.locator('.bug-readonly-list__item').first();
  const hasBug = await firstBug.count();

  if (hasBug) {
    await firstBug.click();
    await page.getByText('基础信息').waitFor({ timeout: 15000 });
  }

  const statisticsLoaded = requests.some((request) =>
    request.url.includes('/api/bugs/statistics') &&
    request.method === 'GET' &&
    request.status === 200
  );
  const bugsLoaded = requests.some((request) =>
    request.url.endsWith('/api/bugs') &&
    request.method === 'GET' &&
    request.status === 200
  );
  const detailLoaded = !hasBug || requests.some((request) =>
    /\/api\/bugs\/\d+$/.test(request.url) &&
    request.method === 'GET' &&
    request.status === 200
  );

  if (!statisticsLoaded || !bugsLoaded || !detailLoaded) {
    throw new Error('Bug management readonly API requests were not observed.');
  }

  const layout = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyClientWidth: document.body.clientWidth,
    bodyScrollWidth: document.body.scrollWidth
  }));

  await page.screenshot({ path: screenshotPath, fullPage: true });

  console.log(JSON.stringify(
    {
      status: layout.scrollWidth > layout.clientWidth ? 'fail' : 'pass',
      baseUrl,
      currentUrl: page.url(),
      screenshotPath,
      clickedDetail: Boolean(hasBug),
      hasHorizontalOverflow:
        layout.scrollWidth > layout.clientWidth || layout.bodyScrollWidth > layout.bodyClientWidth,
      layout,
      consoleMessages,
      pageErrors,
      requests
    },
    null,
    2
  ));

  if (layout.scrollWidth > layout.clientWidth || layout.bodyScrollWidth > layout.bodyClientWidth) {
    process.exitCode = 1;
  }
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
