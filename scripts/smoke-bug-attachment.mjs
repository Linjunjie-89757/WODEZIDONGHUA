import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';

const require = createRequire('D:/CodeProject/auto/web/package.json');
const { chromium } = require('playwright');

const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5173';
const username = process.env.SMOKE_USERNAME || 'superadmin';
const password = process.env.SMOKE_PASSWORD || 'superadmin123';
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const bugTitle = `smoke-bug-attachment-${stamp}`;
const bugDescription = 'smoke bug attachment description';
const attachmentName = `smoke-attachment-${stamp}.txt`;
const attachmentPath = resolve(`output/playwright/${attachmentName}`);
const screenshotPath = `output/playwright/bug-attachment-${stamp}.png`;

await mkdir(dirname(attachmentPath), { recursive: true });
await writeFile(attachmentPath, `smoke attachment ${stamp}`, 'utf8');

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
  await modal.locator('input[placeholder="多个标签用逗号分隔"]').fill('smoke, attachment');
  await page.getByRole('button', { name: '保存' }).click();
  await page.getByText(bugTitle).waitFor({ timeout: 15000 });
}

async function openDetail() {
  await bugCardByTitle(bugTitle).click();
  await page.getByText('基础信息').waitFor({ timeout: 15000 });
}

async function uploadAttachment() {
  await page.getByRole('button', { name: '上传附件' }).click();
  const fileInput = page.locator('input[type="file"]').last();
  await fileInput.setInputFiles(attachmentPath);
  await page
    .locator('.bug-detail-drawer__list li')
    .filter({ hasText: attachmentName })
    .first()
    .waitFor({ timeout: 15000 });
}

async function downloadAttachment() {
  const downloadPromise = page.waitForEvent('download');
  await page.locator('.arco-drawer').getByRole('button', { name: '下载' }).click();
  const download = await downloadPromise;
  await download.path();
}

async function deleteAttachment() {
  await page.locator('.arco-drawer').getByRole('button', { name: '删除' }).click();
  await page.locator('.arco-modal').filter({ hasText: '确认删除这个附件吗' }).getByRole('button', { name: '确定' }).click();
  await page
    .locator('.bug-detail-drawer__list li')
    .filter({ hasText: attachmentName })
    .first()
    .waitFor({ state: 'detached', timeout: 15000 });
}

try {
  await login();
  await createBug();
  await openDetail();
  await uploadAttachment();
  await downloadAttachment();
  await deleteAttachment();
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const uploadRequest = requests.find((request) =>
    /\/api\/bugs\/\d+\/attachments$/.test(request.url) &&
    request.method === 'POST' &&
    request.status === 200
  );
  const downloadRequest = requests.find((request) =>
    /\/api\/bugs\/\d+\/attachments\/\d+\/download$/.test(request.url) &&
    request.method === 'GET' &&
    request.status === 200
  );
  const deleteRequest = requests.find((request) =>
    /\/api\/bugs\/\d+\/attachments\/\d+$/.test(request.url) &&
    request.method === 'DELETE' &&
    request.status === 200
  );

  if (!uploadRequest || !downloadRequest || !deleteRequest) {
    throw new Error('Bug attachment upload, download, or delete request was not observed.');
  }

  console.log(JSON.stringify(
    {
      status: 'pass',
      baseUrl,
      currentUrl: page.url(),
      bugTitle,
      attachmentName,
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
      attachmentName,
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
