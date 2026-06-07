import { createRequire } from 'node:module';

const require = createRequire('D:/CodeProject/auto/web/package.json');
const { chromium } = require('playwright');

const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5173';
const username = process.env.SMOKE_USERNAME || 'superadmin';
const password = process.env.SMOKE_PASSWORD || 'superadmin123';
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const directoryName = `smoke-dir-${stamp}`;
const editedDirectoryName = `${directoryName}-edited`;
const childDirectoryName = `${directoryName}-child`;
const screenshotPath = `output/playwright/case-directory-crud-${stamp}.png`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const requests = [];
const consoleMessages = [];
const pageErrors = [];

page.on('response', (response) => {
  const url = response.url();

  if (url.includes('/api/auth') || url.includes('/api/workspaces') || url.includes('/api/cases')) {
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
  await page.goto(`${baseUrl}/case-center`, { waitUntil: 'networkidle' });

  if (page.url().includes('/login')) {
    await page.getByPlaceholder('请输入账号').fill(username);
    await page.getByPlaceholder('请输入密码').fill(password);
    await page.getByRole('button', { name: '登录' }).click();
  }

  await page.waitForURL('**/case-center', { timeout: 15000 });
  await page.getByRole('heading', { name: '用例中心总览' }).waitFor({ timeout: 15000 });
}

function directoryRowByName(name) {
  return page
    .locator(`.case-directory-node__label-text[title="${name}"]`)
    .locator('xpath=ancestor::div[contains(@class, "case-directory-node")][1]')
    .first();
}

async function cleanupSmokeDirectories() {
  await page.waitForTimeout(500);
  const staleLabels = page.locator('.case-directory-node__label-text[title^="smoke-dir-"]');

  while ((await staleLabels.count()) > 0) {
    const staleName = await staleLabels.last().textContent();
    if (!staleName) {
      break;
    }
    await directoryRowByName(staleName).getByRole('button', { name: '删除' }).click();
    await page.locator('.arco-modal').filter({ hasText: '删除后无法恢复' }).getByRole('button', { name: '确定' }).click();
    await page.waitForResponse((response) =>
      response.url().includes('/api/cases/directories/') &&
      response.request().method() === 'DELETE' &&
      response.status() === 200
    );
    await page.locator(`.case-directory-node__label-text[title="${staleName}"]`).waitFor({ state: 'detached', timeout: 15000 });
    await page.waitForTimeout(300);
  }
}

async function createRootDirectory() {
  await page.getByRole('button', { name: '新增目录' }).click();
  const modal = page.locator('.arco-modal:visible').filter({ hasText: '新增目录' }).first();
  await modal.locator('input[placeholder="请输入目录名称"]').fill(directoryName);
  await page.getByRole('button', { name: '保存' }).click();
  await page.getByText(directoryName).waitFor({ timeout: 15000 });
}

async function renameDirectory() {
  const row = directoryRowByName(directoryName);
  await row.getByRole('button', { name: '重命名' }).click();
  const modal = page.locator('.arco-modal:visible').filter({ hasText: `重命名目录 ${directoryName}` }).first();
  await modal.locator('input[placeholder="请输入目录名称"]').fill(editedDirectoryName);
  await page.getByRole('button', { name: '保存' }).click();
  await page.getByText(editedDirectoryName).waitFor({ timeout: 15000 });
}

async function createChildDirectory() {
  const row = directoryRowByName(editedDirectoryName);
  await row.getByRole('button', { name: '新增子目录' }).click();
  const modal = page.locator('.arco-modal:visible').filter({ hasText: '新增子目录' }).first();
  await modal.locator('input[placeholder="请输入目录名称"]').fill(childDirectoryName);
  await page.getByRole('button', { name: '保存' }).click();
  await page.getByText(childDirectoryName).waitFor({ timeout: 15000 });
}

async function moveDirectoryToRoot() {
  const row = directoryRowByName(editedDirectoryName);
  await row.getByRole('button', { name: '移到根目录' }).click();
  await page.waitForResponse((response) =>
    response.url().includes('/api/cases/directories/') &&
    response.url().includes('/move') &&
    response.request().method() === 'POST' &&
    response.status() === 200
  );
}

async function deleteDirectory(name) {
  const row = directoryRowByName(name);
  await row.getByRole('button', { name: '删除' }).click();
  await page.locator('.arco-modal').filter({ hasText: '删除后无法恢复' }).getByRole('button', { name: '确定' }).click();
  await page.getByText(name).waitFor({ state: 'detached', timeout: 15000 });
}

try {
  await login();
  await cleanupSmokeDirectories();
  await createRootDirectory();
  await renameDirectory();
  await createChildDirectory();
  await moveDirectoryToRoot();
  await deleteDirectory(childDirectoryName);
  await deleteDirectory(editedDirectoryName);
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const bodyText = await page.locator('body').textContent();

  console.log(JSON.stringify(
    {
      status: 'pass',
      baseUrl,
      currentUrl: page.url(),
      directoryName,
      editedDirectoryName,
      childDirectoryName,
      screenshotPath,
      directoryVisibleAfterDelete:
        bodyText?.includes(editedDirectoryName) || bodyText?.includes(childDirectoryName) || false,
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
      directoryName,
      editedDirectoryName,
      childDirectoryName,
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
