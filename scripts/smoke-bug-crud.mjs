import { createRequire } from 'node:module';

const require = createRequire('D:/CodeProject/auto/web/package.json');
const { chromium } = require('playwright');

const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5173';
const username = process.env.SMOKE_USERNAME || 'superadmin';
const password = process.env.SMOKE_PASSWORD || 'superadmin123';
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const bugTitle = `smoke-bug-${stamp}`;
const editedBugTitle = `${bugTitle}-edited`;
const bugDescription = 'smoke bug description';
const editedBugDescription = 'smoke bug description edited';
const screenshotPath = `output/playwright/bug-crud-${stamp}.png`;

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
  await modal.locator('input[placeholder="多个标签用逗号分隔"]').fill('smoke, readonly');
  await page.getByRole('button', { name: '保存' }).click();
  await page.getByText(bugTitle).waitFor({ timeout: 15000 });
}

async function editBug() {
  const card = bugCardByTitle(bugTitle);
  await card.getByRole('button', { name: '编辑' }).click();
  const modal = page.locator('.arco-modal').filter({ hasText: `编辑缺陷 ${bugTitle}` }).first();
  await page.waitForTimeout(500);

  const descriptionValue = await modal.locator('textarea[placeholder="请输入缺陷描述"]').inputValue();
  if (descriptionValue !== bugDescription) {
    throw new Error('Bug edit dialog did not preload description.');
  }

  await modal.locator('input[placeholder="请输入缺陷标题"]').fill(editedBugTitle);
  await modal.locator('textarea[placeholder="请输入缺陷描述"]').fill(editedBugDescription);
  await modal.locator('input[placeholder="多个标签用逗号分隔"]').fill('smoke, edited');
  await page.getByRole('button', { name: '保存' }).click();
  await page.getByText(editedBugTitle).waitFor({ timeout: 15000 });
}

async function openEditedDetail() {
  await bugCardByTitle(editedBugTitle).click();
  await page.getByText('基础信息').waitFor({ timeout: 15000 });
  await page.getByText(editedBugDescription).waitFor({ timeout: 15000 });
}

try {
  await login();
  await createBug();
  await editBug();
  await openEditedDetail();
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const createRequest = requests.find((request) =>
    request.url.endsWith('/api/bugs') &&
    request.method === 'POST' &&
    request.status === 200
  );
  const updateRequest = requests.find((request) =>
    /\/api\/bugs\/\d+$/.test(request.url) &&
    request.method === 'PUT' &&
    request.status === 200
  );

  if (!createRequest || !updateRequest) {
    throw new Error('Bug create or update request was not observed.');
  }

  console.log(JSON.stringify(
    {
      status: 'pass',
      baseUrl,
      currentUrl: page.url(),
      bugTitle,
      editedBugTitle,
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
      editedBugTitle,
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
