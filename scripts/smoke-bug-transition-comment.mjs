import { createRequire } from 'node:module';

const require = createRequire('D:/CodeProject/auto/web/package.json');
const { chromium } = require('playwright');

const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5173';
const username = process.env.SMOKE_USERNAME || 'superadmin';
const password = process.env.SMOKE_PASSWORD || 'superadmin123';
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const bugTitle = `smoke-bug-flow-${stamp}`;
const bugDescription = 'smoke bug transition comment description';
const transitionComment = `smoke transition ${stamp}`;
const bugComment = `smoke comment ${stamp}`;
const screenshotPath = `output/playwright/bug-transition-comment-${stamp}.png`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const requests = [];
const consoleMessages = [];
const pageErrors = [];

page.on('response', (response) => {
  const url = response.url();

  if (url.includes('/api/auth') || url.includes('/api/workspaces') || url.includes('/api/users') || url.includes('/api/bugs')) {
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
  await page.getByRole('heading', { name: '缺陷管理总览' }).waitFor({ timeout: 15000 });
}

function bugCardByTitle(title) {
  return page.locator('.bug-readonly-list__item').filter({ hasText: title }).first();
}

async function chooseFirstAssignee(modal) {
  await modal
    .locator('.arco-form-item')
    .filter({ hasText: '处理人' })
    .locator('.arco-select-view')
    .click();
  await page.keyboard.press('Enter');
}

async function createBug() {
  await page.getByRole('button', { name: '新增缺陷' }).click();
  const modal = page.locator('.arco-modal').filter({ hasText: '新增缺陷' }).first();
  await modal.locator('input[placeholder="请输入缺陷标题"]').fill(bugTitle);
  await modal.locator('textarea[placeholder="请输入缺陷描述"]').fill(bugDescription);
  await chooseFirstAssignee(modal);
  await modal.locator('input[placeholder="多个标签用逗号分隔"]').fill('smoke, flow');
  await page.getByRole('button', { name: '保存' }).click();
  await page.getByText(bugTitle).waitFor({ timeout: 15000 });
}

async function openDetail() {
  await bugCardByTitle(bugTitle).click();
  await page.getByText('基础信息').waitFor({ timeout: 15000 });
}

async function transitionBug() {
  await page.getByRole('button', { name: '状态流转' }).click();
  const modal = page.locator('.arco-modal').filter({ hasText: '状态流转' }).first();
  await modal.locator('.arco-form-item').filter({ hasText: '目标状态' }).locator('.arco-select-view').click();
  await page.getByText('IN_PROGRESS').last().click();
  await modal.locator('textarea[placeholder="请输入流转备注，可留空"]').fill(transitionComment);
  await page.getByRole('button', { name: '保存' }).click();
  await page.locator('.arco-drawer').getByText('IN_PROGRESS').first().waitFor({ timeout: 15000 });
  await page.getByText(transitionComment).waitFor({ timeout: 15000 });
}

async function addComment() {
  await page.getByRole('button', { name: '新增评论' }).click();
  const modal = page.locator('.arco-modal').filter({ hasText: '新增评论' }).first();
  await modal.locator('textarea[placeholder="请输入评论内容"]').fill(bugComment);
  await page.getByRole('button', { name: '保存' }).click();
  await page.locator('.arco-drawer').getByText(bugComment).first().waitFor({ timeout: 15000 });
}

try {
  await login();
  await createBug();
  await openDetail();
  await transitionBug();
  await addComment();
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const transitionRequest = requests.find((request) =>
    /\/api\/bugs\/\d+\/transition$/.test(request.url) &&
    request.method === 'POST' &&
    request.status === 200
  );
  const commentRequest = requests.find((request) =>
    /\/api\/bugs\/\d+\/comments$/.test(request.url) &&
    request.method === 'POST' &&
    request.status === 200
  );

  if (!transitionRequest || !commentRequest) {
    throw new Error('Bug transition or comment request was not observed.');
  }

  console.log(JSON.stringify(
    {
      status: 'pass',
      baseUrl,
      currentUrl: page.url(),
      bugTitle,
      transitionComment,
      bugComment,
      screenshotPath,
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
      bugTitle,
      transitionComment,
      bugComment,
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
