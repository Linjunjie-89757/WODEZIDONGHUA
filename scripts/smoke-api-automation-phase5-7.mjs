import { createRequire } from 'node:module';

const require = createRequire('D:/CodeProject/auto/web/package.json');
const { chromium } = require('playwright');

const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5173';
const username = process.env.SMOKE_USERNAME || 'superadmin';
const password = process.env.SMOKE_PASSWORD || 'superadmin123';
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const definitionName = `smoke-phase57-definition-${stamp}`;
const caseName = `smoke-phase57-case-${stamp}`;
const scenarioName = `smoke-phase57-scenario-${stamp}`;
const screenshotPath = `output/playwright/api-automation-phase5-7-${stamp}.png`;
const smokeRequestUrl = 'http://localhost:8080/api/auth/me';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const requests = [];
const failedResponses = [];
const consoleMessages = [];
const pageErrors = [];

page.on('response', (response) => {
  const url = response.url();

  if (
    url.includes('/api/auth') ||
    url.includes('/api/workspaces') ||
    url.includes('/api/automation/api') ||
    url.includes('/api/settings/db-connections')
  ) {
    requests.push({
      method: response.request().method(),
      url,
      status: response.status(),
      postData: response.request().method() === 'POST' &&
        url.includes('/api/automation/api/scenarios')
        ? response.request().postData()
        : undefined
    });

    if (response.status() >= 400) {
      response.text().then((text) => {
        failedResponses.push({
          method: response.request().method(),
          url,
          status: response.status(),
          body: text
        });
      }).catch(() => undefined);
    }
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

function inputByTestId(testId) {
  return page.getByTestId(testId).locator('input, textarea').first();
}

function scenarioEditorStepRows(selector = '') {
  return page.locator(`[data-testid="api-scenario-editor-workspace"] [data-testid="api-scenario-step-row"]${selector}:visible`);
}

async function waitForVisibleScenarioStepCount(selector, expectedCount) {
  await page.waitForFunction(
    ({ selector, expectedCount }) => {
      const rows = Array.from(document.querySelectorAll(
        `[data-testid="api-scenario-editor-workspace"] [data-testid="api-scenario-step-row"]${selector}`
      ));

      return rows.filter((element) =>
        Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length)
      ).length === expectedCount;
    },
    { selector, expectedCount },
    { timeout: 10000 }
  );
}

async function openWorkbenchTab(label) {
  await page
    .getByTestId('api-automation-workbench-tabs')
    .locator('> .arco-tabs-nav .arco-tabs-tab-title')
    .filter({ hasText: label })
    .click();
}

async function clickVisibleModalPrimaryButton() {
  await page.locator('.arco-modal:visible .arco-modal-footer .arco-btn-primary').last().click();
}

async function closeVisibleDrawer() {
  const closeButton = page.locator('.arco-drawer:visible .arco-drawer-close-btn, .arco-drawer:visible .arco-icon-close').last();

  if ((await closeButton.count()) > 0) {
    await closeButton.click();
  } else {
    await page.keyboard.press('Escape');
  }

  await page.locator('.arco-drawer:visible').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => undefined);
}

async function login() {
  await page.goto(`${baseUrl}/api-automation`, { waitUntil: 'networkidle' });

  if (page.url().includes('/login')) {
    await page.locator('input[type="text"]').fill(username);
    await page.locator('input[type="password"]').fill(password);
    await page.locator('form button').click();
  }

  await page.waitForURL('**/api-automation', { timeout: 15000 });
}

async function cleanupRows(rowTestId, namePrefix, deleteTestId, deletePathPart) {
  const rows = page.getByTestId(rowTestId).filter({ hasText: namePrefix });

  while ((await rows.count()) > 0) {
    const row = rows.first();
    await row.getByTestId(deleteTestId).click();
    await clickVisibleModalPrimaryButton();
    await page.waitForResponse((response) =>
      response.url().includes(deletePathPart) &&
      response.request().method() === 'DELETE' &&
      response.status() >= 200 &&
      response.status() < 300
    );
    await row.waitFor({ state: 'detached', timeout: 15000 });
  }
}

async function apiFetch(path, init = {}) {
  return page.evaluate(
    async ({ path, init }) => {
      const response = await fetch(`/api${path}`, {
        ...init,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Workspace-Code': 'account-open',
          ...(init.headers || {})
        }
      });

      const text = await response.text();
      let body = null;

      try {
        body = text ? JSON.parse(text) : null;
      } catch {
        body = text;
      }

      return {
        status: response.status,
        body
      };
    },
    { path, init }
  );
}

function pageItems(payload) {
  const data = payload?.body?.data;

  if (Array.isArray(data)) {
    return data;
  }

  return data?.items || [];
}

async function cleanupByApi() {
  const scenarioPage = await apiFetch('/automation/api/scenarios');
  const scenarios = pageItems(scenarioPage).filter((item) =>
    String(item.name || '').startsWith('smoke-phase57-scenario-')
  );

  for (const scenario of scenarios) {
    await apiFetch(`/automation/api/scenarios/${scenario.id}`, { method: 'DELETE' });
  }

  const casePage = await apiFetch('/automation/api/cases');
  const cases = pageItems(casePage).filter((item) =>
    String(item.name || '').startsWith('smoke-phase57-case-')
  );

  for (const item of cases) {
    await apiFetch(`/automation/api/cases/${item.id}`, { method: 'DELETE' });
  }

  const definitionPage = await apiFetch('/automation/api/definitions');
  const definitions = pageItems(definitionPage).filter((item) =>
    String(item.name || '').startsWith('smoke-phase57-definition-')
  );

  for (const definition of definitions) {
    await apiFetch(`/automation/api/definitions/${definition.id}`, { method: 'DELETE' });
  }
}

async function cleanupSmokeData() {
  await cleanupRows(
    'api-scenario-row',
    'smoke-phase57-scenario-',
    'api-scenario-delete',
    '/api/automation/api/scenarios/'
  ).catch(() => undefined);
  await cleanupByApi();
}

async function fillDefinitionForm() {
  await inputByTestId('api-definition-name-input').fill(definitionName);
  await page.getByTestId('api-definition-method-select').click();
  await page.locator('.arco-select-option').filter({ hasText: 'GET' }).first().click();
  await inputByTestId('api-definition-path-input').fill(smokeRequestUrl);
  await inputByTestId('api-definition-timeout-input').fill('10000');
  await inputByTestId('api-definition-header-key-input').fill('X-Smoke-Phase');
  await inputByTestId('api-definition-header-value-input').fill('5-7');
}

async function addProcessor(stage, optionText, inputTestId, value) {
  const panel = page.getByTestId('api-processor-editor');
  await panel.getByText(stage === 'pre' ? '前置处理器' : '后置处理器').locator('..').getByText('添加处理器').click();
  await page.locator('.arco-dropdown .arco-dropdown-option').filter({ hasText: optionText }).first().click();
  await inputByTestId(inputTestId).fill(value);
}

async function createDefinitionWithProcessors() {
  await page.getByTestId('api-definition-create').click();
  await fillDefinitionForm();
  await page.getByTestId('api-processor-editor').waitFor({ timeout: 15000 });
  await addProcessor('pre', '脚本处理器', 'pre-script-processor-input', 'vars.put("phase", "5");');
  await addProcessor('post', '提取处理器', 'post-extract-variable-input', 'success');
  await clickVisibleModalPrimaryButton();
  await page.getByText(definitionName).waitFor({ timeout: 15000 });
}

async function selectDefinition() {
  const row = page.getByTestId('api-definition-row').filter({ hasText: definitionName }).first();
  await row.click();
}

async function openCasesWorkbench() {
  await openWorkbenchTab('用例');
  await casesWorkbench().getByTestId('api-case-management').waitFor({ timeout: 15000 });
}

function casesWorkbench() {
  return page.getByTestId('api-automation-cases-tab');
}

async function openScenarioListTabAndWaitForRow(name) {
  await page.getByTestId('api-scenario-list-editor-tab').click();
  await page.getByTestId('api-scenario-list').waitFor({ timeout: 15000 });
  await page.getByTestId('api-scenario-row').filter({ hasText: name }).first().waitFor({ timeout: 15000 });
}

async function createCase() {
  const casesPanel = casesWorkbench();
  await casesPanel.getByTestId('api-case-create').click();
  await inputByTestId('api-case-name-input').fill(caseName);
  await inputByTestId('api-case-path-input').fill(smokeRequestUrl);
  await clickVisibleModalPrimaryButton();
  await casesPanel.getByText(caseName).waitFor({ timeout: 15000 });
}

async function runCaseIfAvailable() {
  const casesPanel = casesWorkbench();
  const row = casesPanel.getByTestId('api-case-row').filter({ hasText: caseName }).first();
  const runResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/api/automation/api/cases/') &&
    response.url().includes('/run') &&
    response.request().method() === 'POST' &&
    response.status() >= 200 &&
    response.status() < 300
  );

  await row.getByTestId('api-case-run').click();
  await runResponsePromise;
  await row.locator('.api-case-management__row-main').click();
  const caseDrawer = page.locator('.arco-drawer:visible').last();
  await caseDrawer.getByTestId('api-case-drawer-view-tabs').waitFor({ timeout: 25000 });
  await caseDrawer.getByTestId('api-case-drawer-detail-tab').waitFor({ timeout: 25000 });
  const runResult = caseDrawer.getByTestId('api-case-run-result');
  await runResult.waitFor({ timeout: 25000 });
  await runResult.getByTestId('api-run-result-panel').waitFor({ timeout: 25000 });
  await runResult.getByTestId('api-run-result-status').waitFor({ timeout: 25000 });
  await runResult.getByTestId('api-run-result-response-body').waitFor({ timeout: 25000 });
  await caseDrawer.getByTestId('api-case-drawer-run-history-tab').click();
  await caseDrawer.getByTestId('api-case-run-history').waitFor({ timeout: 25000 });
  await caseDrawer.getByTestId('api-case-run-history-row').first().waitFor({ timeout: 25000 });
  await caseDrawer.getByTestId('api-case-run-history-detail-entry').first().click();
  await caseDrawer.getByTestId('api-case-run-history-detail').waitFor({ timeout: 25000 });
  await caseDrawer.getByTestId('api-case-run-history-detail').getByTestId('api-run-result-panel').waitFor({ timeout: 25000 });
  await caseDrawer.getByTestId('api-case-run-history-back').click();
  await caseDrawer.getByTestId('api-case-drawer-change-history-tab').click();
  await caseDrawer.getByTestId('api-case-change-history').waitFor({ timeout: 25000 });
  await closeVisibleDrawer();
}

async function createScenario() {
  await openWorkbenchTab('场景');
  await page.getByTestId('api-scenario-management').waitFor({ timeout: 15000 });
  await page.getByTestId('api-scenario-list-refresh').click();
  await page.waitForResponse((response) =>
    response.url().includes('/api/automation/api/cases') &&
    response.request().method() === 'GET' &&
    response.status() >= 200 &&
    response.status() < 300
  );
  await page.getByTestId('api-scenario-rail-create').click();
  await inputByTestId('api-scenario-name-input').fill(scenarioName);
  await page.getByTestId('api-scenario-step-editor').first().waitFor({ timeout: 15000 });
  await inputByTestId('api-scenario-custom-path-input').fill(smokeRequestUrl);
  await page.getByTestId('api-scenario-add-definition-step').click();
  await page.getByTestId('api-scenario-definition-select').last().click();
  await page.locator('.arco-select-option').filter({ hasText: definitionName }).last().click();
  await page.getByTestId('api-scenario-add-case-step').click();
  await page.getByTestId('api-scenario-case-select').last().click();
  await page.locator('.arco-select-option').filter({ hasText: caseName }).last().click();
  await page.getByTestId('api-scenario-add-group-step').click();

  const groupRow = page.locator('[data-testid="api-scenario-step-row"][data-step-type="GROUP"]').last();
  await groupRow.getByTestId('api-scenario-add-child-custom-step').click();
  await page.locator('[data-testid="api-scenario-step-row"][data-depth="1"]').last().getByTestId('api-scenario-custom-path-input').locator('input, textarea').first().fill(smokeRequestUrl);
  await groupRow.getByTestId('api-scenario-add-child-definition-step').click();
  await page.locator('[data-testid="api-scenario-step-row"][data-depth="1"]').last().getByTestId('api-scenario-definition-select').click();
  await page.locator('.arco-select-option').filter({ hasText: definitionName }).last().click();
  await clickVisibleModalPrimaryButton();
  await page.getByText(scenarioName).waitFor({ timeout: 15000 });
}

async function editScenarioAndVerifySteps() {
  let row = page.getByTestId('api-scenario-row').filter({ hasText: scenarioName }).first();
  const detailResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/api/automation/api/scenarios/') &&
    response.request().method() === 'GET' &&
    response.status() >= 200 &&
    response.status() < 300
  );

  await row.getByTestId('api-scenario-edit').click();
  await detailResponsePromise;
  await page.getByTestId('api-scenario-editor-workspace').waitFor({ timeout: 15000 });
  await page.getByTestId('api-scenario-property-panel').waitFor({ timeout: 15000 });
  await page.getByTestId('api-scenario-property-run-context').waitFor({ timeout: 15000 });
  await page.getByTestId('api-scenario-property-step-stats').waitFor({ timeout: 15000 });
  await page.getByTestId('api-scenario-selected-step-inspector').waitFor({ timeout: 15000 });
  await page.getByTestId('api-scenario-workbench-name-input').locator('input, textarea').first().waitFor({ timeout: 15000 });
  await page.getByTestId('api-scenario-step-editor').first().waitFor({ timeout: 15000 });
  await scenarioEditorStepRows('[data-step-type="CUSTOM_REQUEST"]').first().waitFor({ timeout: 15000 });
  await scenarioEditorStepRows('[data-step-type="CUSTOM_REQUEST"]').first().click();
  await page.getByTestId('api-scenario-selected-step-inspector').getByText('请求摘要').waitFor({ timeout: 15000 });
  await scenarioEditorStepRows('[data-step-type="API"]').first().waitFor({ timeout: 15000 });
  await scenarioEditorStepRows('[data-step-type="API_CASE"]').first().waitFor({ timeout: 15000 });
  await scenarioEditorStepRows('[data-step-type="GROUP"]').first().waitFor({ timeout: 15000 });
  await scenarioEditorStepRows('[data-depth="1"]').first().waitFor({ timeout: 15000 });

  const editedRequestUrl = 'http://localhost:8080/api/workspaces/switchable';
  const customStep = scenarioEditorStepRows('[data-step-type="CUSTOM_REQUEST"][data-depth="0"]').first();
  await customStep.getByTestId('api-scenario-custom-path-input').locator('input, textarea').first().fill(editedRequestUrl);
  await customStep.getByTestId('api-scenario-step-move-down').click();
  await scenarioEditorStepRows('[data-step-type="CUSTOM_REQUEST"][data-depth="0"]').first().getByTestId('api-scenario-step-move-up').click();

  const nestedDefinitionStep = scenarioEditorStepRows('[data-step-type="API"][data-depth="1"]').first();
  await nestedDefinitionStep.getByTestId('api-scenario-step-delete').click();
  await waitForVisibleScenarioStepCount('[data-step-type="API"][data-depth="1"]', 0);
  const updateResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/api/automation/api/scenarios/') &&
    response.request().method() === 'PUT' &&
    response.status() >= 200 &&
    response.status() < 300
  );
  await page.getByTestId('api-scenario-workbench-save').click();
  await updateResponsePromise;
  await page.getByTestId('api-scenario-editor-workspace').waitFor({ timeout: 15000 });

  await openScenarioListTabAndWaitForRow(scenarioName);
  row = page.getByTestId('api-scenario-row').filter({ hasText: scenarioName }).first();
  await row.getByTestId('api-scenario-edit').click();
  await page.getByTestId('api-scenario-editor-workspace').waitFor({ timeout: 15000 });
  await page.getByTestId('api-scenario-step-editor').first().waitFor({ timeout: 15000 });
  await page.getByTestId('api-scenario-result-tab').waitFor({ timeout: 15000 });
  await page.getByTestId('api-scenario-history-tab').waitFor({ timeout: 15000 });
  const persistedPath = await scenarioEditorStepRows('[data-step-type="CUSTOM_REQUEST"][data-depth="0"]').first().getByTestId('api-scenario-custom-path-input').locator('input, textarea').first().inputValue();

  if (persistedPath !== editedRequestUrl) {
    throw new Error('Scenario custom request path was not persisted after edit.');
  }

  await scenarioEditorStepRows('[data-step-type="GROUP"]').first().waitFor({ timeout: 15000 });
  await scenarioEditorStepRows('[data-depth="1"]').first().waitFor({ timeout: 15000 });
  await page.getByTestId('api-scenario-list-editor-tab').click();
}

async function runScenarioIfAvailable() {
  const row = page.getByTestId('api-scenario-row').filter({ hasText: scenarioName }).first();
  const runResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/api/automation/api/scenarios/') &&
    response.url().includes('/run') &&
    response.request().method() === 'POST' &&
    response.status() >= 200 &&
    response.status() < 300
  );

  await row.getByTestId('api-scenario-run').click();
  await runResponsePromise;
  await row.getByTestId('api-scenario-edit').click();
  await page.getByTestId('api-scenario-editor-workspace').waitFor({ timeout: 15000 });
  await page.getByTestId('api-scenario-result-tab').click();
  await page.getByTestId('api-scenario-workbench-run-result').waitFor({ timeout: 25000 });
  await page.getByTestId('api-scenario-workbench-run-result').getByTestId('api-run-result-panel').waitFor({ timeout: 25000 });
  await page.getByTestId('api-scenario-workbench-run-result').getByTestId('api-run-result-header').waitFor({ timeout: 25000 });
  await page.getByTestId('api-scenario-workbench-run-result').getByTestId('api-run-result-content-panel').waitFor({ timeout: 25000 });
  await page.getByTestId('api-scenario-workbench-run-result').getByTestId('api-run-result-status').waitFor({ timeout: 25000 });
  await page.getByTestId('api-scenario-workbench-run-result').getByTestId('api-run-result-response-body').waitFor({ timeout: 25000 });
  await page.getByTestId('api-scenario-history-tab').click();
  await page.getByTestId('api-scenario-workbench-history').waitFor({ timeout: 25000 });
  await page.getByTestId('api-scenario-workbench-history').getByTestId('api-run-result-step-row').first().waitFor({ timeout: 25000 });
  await page.getByTestId('api-scenario-list-editor-tab').click();
  await row.click();
  await page.getByTestId('api-scenario-step-tree').waitFor({ timeout: 15000 });
  await page.getByTestId('api-scenario-run-result').waitFor({ timeout: 25000 });
  await page.getByTestId('api-scenario-run-result').getByTestId('api-run-result-panel').waitFor({ timeout: 25000 });
  await page.getByTestId('api-scenario-run-result').getByTestId('api-run-result-status').waitFor({ timeout: 25000 });
  await page.getByTestId('api-scenario-run-result').getByTestId('api-run-result-response-body').waitFor({ timeout: 25000 });
  await page.getByTestId('api-scenario-run-result').getByTestId('api-run-result-steps').waitFor({ timeout: 25000 });
}

function hasSuccessfulRequest(pathPart, method) {
  return requests.some((request) =>
    request.url.includes(pathPart) &&
    request.method === method &&
    request.status >= 200 &&
    request.status < 300
  );
}

try {
  await login();
  await page.getByTestId('api-automation-shell').waitFor({ timeout: 15000 });
  await page.getByTestId('api-automation-workbench').waitFor({ timeout: 15000 });
  await page.getByTestId('api-run-context-toolbar').waitFor({ timeout: 15000 });

  await cleanupSmokeData();
  await createDefinitionWithProcessors();
  await selectDefinition();
  await openCasesWorkbench();
  await createCase();
  await runCaseIfAvailable();
  await createScenario();
  await editScenarioAndVerifySteps();
  await runScenarioIfAvailable();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);

  if (overflow) {
    throw new Error('API automation Phase 5-7 page has horizontal overflow.');
  }

  await page.screenshot({ path: screenshotPath, fullPage: true });

  const requiredRequests = [
    ['/api/settings/db-connections', 'GET'],
    ['/api/automation/api/cases', 'GET'],
    ['/api/automation/api/cases', 'POST'],
    ['/api/automation/api/scenario-modules', 'GET'],
    ['/api/automation/api/scenarios', 'GET'],
    ['/api/automation/api/scenarios', 'POST']
  ];
  const missing = requiredRequests.find(([pathPart, method]) => !hasSuccessfulRequest(pathPart, method));

  if (missing) {
    throw new Error(`Missing successful request ${missing[1]} ${missing[0]}`);
  }

  await cleanupByApi();

  console.log(JSON.stringify(
    {
      status: 'pass',
      baseUrl,
      currentUrl: page.url(),
      definitionName,
      caseName,
      scenarioName,
      screenshotPath,
      consoleMessages,
      pageErrors,
      failedResponses,
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
      definitionName,
      caseName,
      scenarioName,
      screenshotPath,
      error: error instanceof Error ? error.message : String(error),
      consoleMessages,
      pageErrors,
      failedResponses,
      requests
    },
    null,
    2
  ));
  process.exitCode = 1;
} finally {
  await browser.close();
}
