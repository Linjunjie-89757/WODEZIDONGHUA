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
    screenshotPath: `output/playwright/case-center-module-desktop-${stamp}.png`,
    createDrawerScreenshotPath: `output/playwright/case-center-create-drawer-desktop-${stamp}.png`,
    editDrawerScreenshotPath: `output/playwright/case-center-edit-drawer-desktop-${stamp}.png`,
    aiScreenshotPath: `output/playwright/case-center-ai-desktop-${stamp}.png`
  },
  {
    name: 'mobile',
    width: 390,
    height: 844,
    screenshotPath: `output/playwright/case-center-module-mobile-${stamp}.png`,
    createDrawerScreenshotPath: `output/playwright/case-center-create-drawer-mobile-${stamp}.png`,
    editDrawerScreenshotPath: `output/playwright/case-center-edit-drawer-mobile-${stamp}.png`,
    aiScreenshotPath: `output/playwright/case-center-ai-mobile-${stamp}.png`
  }
];

const browser = await chromium.launch({ headless: true });
const results = [];

async function login(page) {
  await page.goto(`${baseUrl}/case-center`, { waitUntil: 'networkidle' });

  if (page.url().includes('/login')) {
    await page.getByPlaceholder('请输入账号').fill(username);
    await page.getByPlaceholder('请输入密码').fill(password);
    await page.getByRole('button', { name: '登录' }).click();
  }

  await page.waitForURL('**/case-center', { timeout: 15000 });
  await page.getByRole('button', { name: '用例管理' }).waitFor({ timeout: 15000 });
  await page.getByText('用例分类').waitFor({ timeout: 15000 });
  await page.getByPlaceholder('搜索用例编号、名称...').waitFor({ timeout: 15000 });
  await page.getByRole('columnheader', { name: '用例编号' }).waitFor({ timeout: 15000 });
  await page.getByRole('columnheader', { name: '用例名称' }).waitFor({ timeout: 15000 });
  await page.getByRole('columnheader', { name: '验证方式' }).waitFor({ timeout: 15000 });
  await page.getByRole('columnheader', { name: '用例路径' }).waitFor({ timeout: 15000 });
  await page.getByRole('columnheader', { name: '操作' }).waitFor({ timeout: 15000 });
}

async function verifyCaseDrawer(page, viewport) {
  await page.getByRole('button', { name: '新增用例' }).click();
  await page.getByRole('dialog').getByText('新增用例').waitFor({ timeout: 15000 });
  await page.getByText('用例模块').waitFor({ timeout: 15000 });
  await page.getByText('全部目录').waitFor({ timeout: 15000 });
  await page.screenshot({ path: viewport.createDrawerScreenshotPath, fullPage: true });
  await page.keyboard.press('Escape').catch(() => undefined);
  await page.locator('.case-drawer-form__footer').getByRole('button', { name: '取消' }).click();

  const editButtons = page.getByRole('button', { name: '编辑' });
  const editCount = await editButtons.count();
  let editDrawerCovered = false;

  if (editCount > 0) {
    await editButtons.first().click();
    await page.getByRole('dialog').getByText('编辑用例').waitFor({ timeout: 15000 });
    await page.getByText('用例模块').waitFor({ timeout: 15000 });
    await page.screenshot({ path: viewport.editDrawerScreenshotPath, fullPage: true });
    await page.locator('.case-drawer-form__footer').getByRole('button', { name: '取消' }).click();
    editDrawerCovered = true;
  }

  return {
    editDrawerCovered,
    editButtonCount: editCount
  };
}

async function verifyAiTabs(page) {
  await page.getByRole('button', { name: 'AI 用例生成' }).click();
  await page.getByText('从需求描述生成测试用例').waitFor({ timeout: 15000 });
  await page.getByText('生成过程').waitFor({ timeout: 15000 });
  await page.getByText('生成结果', { exact: true }).waitFor({ timeout: 15000 });

  await page.getByRole('button', { name: 'AI 生成记录' }).click();
  await page.getByText('任务总数').waitFor({ timeout: 15000 });
  await page.getByRole('columnheader', { name: '任务 ID' }).waitFor({ timeout: 15000 });
  await page.getByText('待接入').waitFor({ timeout: 15000 });

  await page.getByRole('button', { name: 'AI 配置' }).click();
  await page.getByText('用例生成', { exact: true }).waitFor({ timeout: 15000 });
  await page.getByText('用例评审', { exact: true }).waitFor({ timeout: 15000 });
  await page.getByText('角色提示词').first().waitFor({ timeout: 15000 });
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
    await page.screenshot({ path: viewport.screenshotPath, fullPage: true });
    const drawerCoverage = await verifyCaseDrawer(page, viewport);
    await verifyAiTabs(page);
    await page.screenshot({ path: viewport.aiScreenshotPath, fullPage: true });

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
      createDrawerScreenshotPath: viewport.createDrawerScreenshotPath,
      editDrawerScreenshotPath: drawerCoverage.editDrawerCovered
        ? viewport.editDrawerScreenshotPath
        : null,
      aiScreenshotPath: viewport.aiScreenshotPath,
      drawerCoverage,
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
