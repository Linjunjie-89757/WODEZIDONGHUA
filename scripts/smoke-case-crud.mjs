import { createRequire } from 'node:module';

const require = createRequire('D:/CodeProject/auto/web/package.json');
const { chromium } = require('playwright');

const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5173';
const username = process.env.SMOKE_USERNAME || 'superadmin';
const password = process.env.SMOKE_PASSWORD || 'superadmin123';
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const caseTitle = `smoke-case-${stamp}`;
const editedCaseTitle = `${caseTitle}-edited`;
const createdPrecondition = 'smoke precondition';
const createdSteps = 'smoke create steps';
const createdExpectedResult = 'smoke expected result';
const editedSteps = 'smoke edit steps';
const screenshotPath = `output/playwright/case-crud-${stamp}.png`;

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

function caseCardByTitle(title) {
  return page.locator('.case-readonly-list__item').filter({ hasText: title }).first();
}

async function cleanupSmokeCases() {
  await page.waitForTimeout(500);
  const staleCards = page.locator('.case-readonly-list__item').filter({ hasText: 'smoke-case-' });

  while ((await staleCards.count()) > 0) {
    const staleTitle = await staleCards.first().locator('.case-readonly-list__title span:last-child').textContent();
    await staleCards.first().getByRole('button', { name: '删除' }).click();
    await page.locator('.arco-modal').filter({ hasText: '删除后无法恢复' }).getByRole('button', { name: '确定' }).click();
    await page.waitForResponse((response) =>
      response.url().includes('/api/cases/') &&
      response.request().method() === 'DELETE' &&
      response.status() === 200
    );
    if (staleTitle) {
      await page.getByText(staleTitle).waitFor({ state: 'detached', timeout: 15000 });
    }
    await page.waitForTimeout(300);
  }
}

async function fillCaseForm(modal, title, steps) {
  await modal.locator('input[placeholder="请输入用例标题"]').fill(title);
  await modal.locator('input[placeholder="请输入用例类型，例如 FUNCTION"]').fill('FUNCTION');
  await modal.locator('input[placeholder="请输入优先级，例如 P1"]').fill('P1');
  await modal.locator('input[placeholder="请输入来源，例如 MANUAL"]').fill('MANUAL');
  await modal.locator('input[placeholder="请输入状态，例如 ACTIVE"]').fill('ACTIVE');
  await modal.locator('textarea[placeholder="请输入前置条件，可留空"]').fill(createdPrecondition);
  await modal.locator('textarea[placeholder="请输入测试步骤"]').fill(steps);
  await modal.locator('textarea[placeholder="请输入预期结果"]').fill(createdExpectedResult);
}

async function createCase() {
  await page.getByRole('button', { name: '新增用例' }).click();
  const modal = page.locator('.arco-modal').filter({ hasText: '新增用例' }).first();
  await fillCaseForm(modal, caseTitle, createdSteps);
  await page.getByRole('button', { name: '保存' }).click();
  await page.getByText(caseTitle).waitFor({ timeout: 15000 });
}

async function editCase() {
  const card = caseCardByTitle(caseTitle);
  await card.getByRole('button', { name: '编辑' }).click();
  const modal = page.locator('.arco-modal').filter({ hasText: `编辑用例 ${caseTitle}` }).first();
  await page.waitForTimeout(500);
  const preconditionValue = await modal.locator('textarea[placeholder="请输入前置条件，可留空"]').inputValue();
  const stepsValue = await modal.locator('textarea[placeholder="请输入测试步骤"]').inputValue();
  const expectedResultValue = await modal.locator('textarea[placeholder="请输入预期结果"]').inputValue();

  if (
    preconditionValue !== createdPrecondition ||
    stepsValue !== createdSteps ||
    expectedResultValue !== createdExpectedResult
  ) {
    throw new Error('Case edit dialog did not preload detail fields.');
  }
  await fillCaseForm(modal, editedCaseTitle, editedSteps);
  await page.getByRole('button', { name: '保存' }).click();
  await page.getByText(editedCaseTitle).waitFor({ timeout: 15000 });
}

async function deleteCase() {
  const card = caseCardByTitle(editedCaseTitle);
  await card.getByRole('button', { name: '删除' }).click();
  await page.locator('.arco-modal').filter({ hasText: '删除后无法恢复' }).getByRole('button', { name: '确定' }).click();
  await page.getByText(editedCaseTitle).waitFor({ state: 'detached', timeout: 15000 });
}

try {
  await login();
  await cleanupSmokeCases();
  await createCase();
  await editCase();
  await deleteCase();
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const bodyText = await page.locator('body').textContent();

  console.log(JSON.stringify(
    {
      status: 'pass',
      baseUrl,
      currentUrl: page.url(),
      caseTitle,
      editedCaseTitle,
      screenshotPath,
      caseVisibleAfterDelete: bodyText?.includes(editedCaseTitle) || false,
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
      caseTitle,
      editedCaseTitle,
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
