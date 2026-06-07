import { createRequire } from 'node:module';

const require = createRequire('D:/CodeProject/auto/web/package.json');
const { chromium } = require('playwright');

const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5173';
const username = process.env.SMOKE_USERNAME || 'superadmin';
const password = process.env.SMOKE_PASSWORD || 'superadmin123';
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const ifScenarioName = `smoke-if-scenario-${stamp}`;
const loopScenarioName = `smoke-loop-scenario-${stamp}`;
const ifMatchedName = `smoke-if-matched-${stamp}`;
const ifNotMatchedName = `smoke-if-not-matched-${stamp}`;
const ifMatchedChildName = `smoke-if-matched-child-${stamp}`;
const ifSkippedChildName = `smoke-if-skipped-child-${stamp}`;
const loopStepName = `smoke-loop-step-${stamp}`;
const loopChildName = `smoke-loop-child-${stamp}`;
const requestUrl = 'http://localhost:8080/api/auth/me';
const screenshotPath = `output/playwright/api-scenario-if-loop-${stamp}.png`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const requests = [];
const failedResponses = [];
const consoleMessages = [];
const pageErrors = [];
let ifCreatePayload = null;
let loopCreatePayload = null;
let ifScenarioId = null;
let loopScenarioId = null;

page.on('response', (response) => {
  const url = response.url();

  if (url.includes('/api/auth') || url.includes('/api/workspaces') || url.includes('/api/automation/api')) {
    requests.push({
      method: response.request().method(),
      url,
      status: response.status()
    });

    if (
      url.includes('/api/automation/api/scenarios') &&
      !url.includes('/run') &&
      response.request().method() === 'POST'
    ) {
      const postData = response.request().postData();
      if (postData?.includes(ifScenarioName)) {
        ifCreatePayload = postData;
      }
      if (postData?.includes(loopScenarioName)) {
        loopCreatePayload = postData;
      }
    }

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
  consoleMessages.push({ type: message.type(), text: message.text() });
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

async function login() {
  await page.goto(`${baseUrl}/api-automation`, { waitUntil: 'networkidle' });

  if (page.url().includes('/login')) {
    await page.locator('input[type="text"]').fill(username);
    await page.locator('input[type="password"]').fill(password);
    await page.locator('form button').click();
  }

  await page.waitForURL('**/api-automation', { timeout: 15000 });
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

      return { status: response.status, body };
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
    String(item.name || '').startsWith('smoke-if-scenario-') ||
    String(item.name || '').startsWith('smoke-loop-scenario-')
  );

  for (const scenario of scenarios) {
    await apiFetch(`/automation/api/scenarios/${scenario.id}`, { method: 'DELETE' });
  }
}

async function reloadScenarioList() {
  await page.keyboard.press('Escape');
  await page.locator('.arco-drawer:visible').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => undefined);
  if ((await page.getByTestId('api-scenario-list-editor-tab').count()) > 0) {
    await page.getByTestId('api-scenario-list-editor-tab').click();
  }
  await page.getByTestId('api-scenario-retry').click();
  await page.getByTestId('api-scenario-list').waitFor({ timeout: 15000 });
}

function parsePayload(payload) {
  return payload ? JSON.parse(payload) : null;
}

function customRequestStep(id, stepName) {
  return {
    id,
    stepName,
    stepType: 'CUSTOM_REQUEST',
    enabled: true,
    resourceId: null,
    resourceType: 'CUSTOM',
    requestConfig: {
      method: 'GET',
      path: requestUrl,
      timeoutMs: 10000,
      queryParams: [],
      headers: [],
      cookies: [],
      body: {
        type: 'RAW',
        rawText: '',
        formItems: [],
        contentType: 'application/json'
      },
      authConfig: {
        authType: 'NONE',
        basicAuth: null,
        digestAuth: null
      }
    },
    assertions: [],
    preProcessors: [],
    postProcessors: [],
    children: []
  };
}

function findStepByName(steps, name) {
  for (const step of steps || []) {
    if (step.stepName === name || step.name === name) {
      return step;
    }

    const child = findStepByName(step.children || [], name);
    if (child) {
      return child;
    }
  }

  return null;
}

function assertIfPayload(payload) {
  const ifStep = findStepByName(payload?.steps || [], ifMatchedName);

  if (!ifStep) {
    throw new Error('IF_CONTROLLER step is missing from create payload.');
  }

  if (ifStep.stepType !== 'IF_CONTROLLER') {
    throw new Error(`IF stepType should be IF_CONTROLLER, got ${ifStep.stepType}.`);
  }

  if (ifStep.conditionType !== 'EXPRESSION') {
    throw new Error(`IF conditionType should be EXPRESSION, got ${ifStep.conditionType}.`);
  }

  if (ifStep.conditionExpression !== 'true') {
    throw new Error(`IF conditionExpression should be true, got ${ifStep.conditionExpression}.`);
  }

  if (!Array.isArray(ifStep.children) || ifStep.children.length !== 1) {
    throw new Error('IF_CONTROLLER should persist one child step.');
  }
}

function assertLoopPayload(payload) {
  const loopStep = findStepByName(payload?.steps || [], loopStepName);

  if (!loopStep) {
    throw new Error('LOOP_CONTROLLER step is missing from create payload.');
  }

  if (loopStep.stepType !== 'LOOP_CONTROLLER') {
    throw new Error(`Loop stepType should be LOOP_CONTROLLER, got ${loopStep.stepType}.`);
  }

  if (loopStep.loopType !== 'FIXED') {
    throw new Error(`Loop loopType should be FIXED, got ${loopStep.loopType}.`);
  }

  if (Number(loopStep.loopCount) !== 2) {
    throw new Error(`Loop loopCount should be 2, got ${loopStep.loopCount}.`);
  }

  if (!Array.isArray(loopStep.children) || loopStep.children.length !== 1) {
    throw new Error('LOOP_CONTROLLER should persist one child step.');
  }
}

async function createIfScenarioInUi() {
  await page.getByTestId('api-scenario-create').click();
  await inputByTestId('api-scenario-name-input').fill(ifScenarioName);
  await page.getByTestId('api-scenario-step-editor').first().waitFor({ timeout: 15000 });
  await inputByTestId('api-scenario-custom-path-input').fill(requestUrl);

  await page.getByTestId('api-scenario-add-if-step').click();
  const ifRow = page.locator('[data-testid="api-scenario-step-row"][data-step-type="IF_CONTROLLER"]').first();
  await ifRow.waitFor({ timeout: 15000 });
  await ifRow.getByTestId('api-scenario-step-name-input').locator('input, textarea').first().fill(ifMatchedName);
  await ifRow.getByTestId('api-scenario-condition-expression-input').locator('input, textarea').first().fill('true');
  await ifRow.getByTestId('api-scenario-add-child-custom-step').click();
  const childRow = ifRow.locator('[data-testid="api-scenario-step-row"][data-depth="1"][data-step-type="CUSTOM_REQUEST"]').first();
  await childRow.getByTestId('api-scenario-step-name-input').locator('input, textarea').first().fill(ifMatchedChildName);
  await childRow.getByTestId('api-scenario-custom-path-input').locator('input, textarea').first().fill(requestUrl);
  await ifRow.getByTestId('api-scenario-step-move-up').first().click();

  const createResponse = page.waitForResponse((response) =>
    response.url().includes('/api/automation/api/scenarios') &&
    response.request().method() === 'POST' &&
    response.status() >= 200 &&
    response.status() < 300
  );
  await clickVisibleModalPrimaryButton();
  await createResponse;
  await page.getByText(ifScenarioName).waitFor({ timeout: 15000 });
  assertIfPayload(parsePayload(ifCreatePayload));

  const created = await apiFetch('/automation/api/scenarios');
  ifScenarioId = pageItems(created).find((item) => item.name === ifScenarioName)?.id || null;
  if (!ifScenarioId) {
    throw new Error('Could not resolve IF scenario id.');
  }
}

async function verifyIfScenarioHydrationAndRun() {
  let row = page.getByTestId('api-scenario-row').filter({ hasText: ifScenarioName }).first();
  await row.getByTestId('api-scenario-edit').click();
  await page.getByTestId('api-scenario-editor-workspace').waitFor({ timeout: 15000 });
  const ifRow = scenarioEditorStepRows('[data-step-type="IF_CONTROLLER"]').first();
  await ifRow.waitFor({ timeout: 15000 });
  const expression = await ifRow.getByTestId('api-scenario-condition-expression-input').locator('input, textarea').first().inputValue();
  if (expression !== 'true') {
    throw new Error(`IF condition expression was not hydrated. Expected true, got ${expression}.`);
  }
  await page.getByTestId('api-scenario-list-editor-tab').click();

  row = page.getByTestId('api-scenario-row').filter({ hasText: ifScenarioName }).first();
  await row.locator('.api-scenario-management__row-main').click();
  await page.getByTestId('api-scenario-detail').waitFor({ timeout: 15000 });
  await page.keyboard.press('Escape');
  await page.locator('.arco-drawer:visible').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => undefined);

  const runResponse = page.waitForResponse((response) =>
    response.url().includes(`/api/automation/api/scenarios/${ifScenarioId}/run`) &&
    response.request().method() === 'POST' &&
    response.status() >= 200 &&
    response.status() < 300
  );
  await row.getByTestId('api-scenario-run').click();
  await runResponse;
  await page.getByTestId('api-run-result-step-row')
    .filter({ hasText: ifMatchedName })
    .filter({ hasText: 'Condition matched' })
    .waitFor({ timeout: 25000 });
  await page.getByTestId('api-run-result-step-row')
    .filter({ hasText: ifMatchedChildName })
    .waitFor({ timeout: 25000 });
}

async function createIfNotMatchedScenarioByApi() {
  const payload = {
    workspaceCode: 'account-open',
    moduleId: null,
    name: `${ifScenarioName}-not-matched`,
    description: 'IF_CONTROLLER not matched smoke',
    status: 'ACTIVE',
    environmentId: null,
    variableSetId: null,
    variables: [],
    assertions: [],
    steps: [
      {
        id: `if-not-matched-${stamp}`,
        stepName: ifNotMatchedName,
        stepType: 'IF_CONTROLLER',
        enabled: true,
        conditionType: 'EXPRESSION',
        conditionExpression: 'false',
        children: [customRequestStep(`if-skipped-child-${stamp}`, ifSkippedChildName)]
      }
    ]
  };
  const response = await apiFetch('/automation/api/scenarios', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Failed to create IF not matched scenario: ${response.status}.`);
  }
  const scenarioId = response.body?.data?.id || response.body?.id;
  const runResponse = await apiFetch(`/automation/api/scenarios/${scenarioId}/run`, {
    method: 'POST',
    body: JSON.stringify({ workspaceCode: 'account-open', environmentId: null, variableSetId: null })
  });
  const runData = runResponse.body?.data || runResponse.body;
  const steps = runData?.stepResults || [];
  if (!steps.some((step) => step.stepName === ifNotMatchedName)) {
    throw new Error('IF not matched controller result is missing.');
  }
  if (steps.some((step) => step.stepName === ifSkippedChildName)) {
    throw new Error('IF not matched child should not execute.');
  }
}

async function createLoopScenarioInUi() {
  await reloadScenarioList();
  await page.getByTestId('api-scenario-create').click();
  await inputByTestId('api-scenario-name-input').fill(loopScenarioName);
  await page.getByTestId('api-scenario-step-editor').first().waitFor({ timeout: 15000 });
  await inputByTestId('api-scenario-custom-path-input').fill(requestUrl);

  await page.getByTestId('api-scenario-add-loop-step').click();
  const loopRow = page.locator('[data-testid="api-scenario-step-row"][data-step-type="LOOP_CONTROLLER"]').first();
  await loopRow.waitFor({ timeout: 15000 });
  await loopRow.getByTestId('api-scenario-step-name-input').locator('input, textarea').first().fill(loopStepName);
  await loopRow.getByTestId('api-scenario-loop-count-input').locator('input, textarea').first().fill('2');
  await loopRow.getByTestId('api-scenario-add-child-custom-step').click();
  const childRow = loopRow.locator('[data-testid="api-scenario-step-row"][data-depth="1"][data-step-type="CUSTOM_REQUEST"]').first();
  await childRow.getByTestId('api-scenario-step-name-input').locator('input, textarea').first().fill(loopChildName);
  await childRow.getByTestId('api-scenario-custom-path-input').locator('input, textarea').first().fill(requestUrl);
  await loopRow.getByTestId('api-scenario-step-move-up').first().click();

  const createResponse = page.waitForResponse((response) =>
    response.url().includes('/api/automation/api/scenarios') &&
    response.request().method() === 'POST' &&
    response.status() >= 200 &&
    response.status() < 300
  );
  await clickVisibleModalPrimaryButton();
  await createResponse;
  await page.getByText(loopScenarioName).waitFor({ timeout: 15000 });
  assertLoopPayload(parsePayload(loopCreatePayload));

  const created = await apiFetch('/automation/api/scenarios');
  loopScenarioId = pageItems(created).find((item) => item.name === loopScenarioName)?.id || null;
  if (!loopScenarioId) {
    throw new Error('Could not resolve LOOP scenario id.');
  }
}

async function verifyLoopScenarioHydrationAndRun() {
  let row = page.getByTestId('api-scenario-row').filter({ hasText: loopScenarioName }).first();
  await row.getByTestId('api-scenario-edit').click();
  await page.getByTestId('api-scenario-editor-workspace').waitFor({ timeout: 15000 });
  const loopRow = scenarioEditorStepRows('[data-step-type="LOOP_CONTROLLER"]').first();
  await loopRow.waitFor({ timeout: 15000 });
  const count = await loopRow.getByTestId('api-scenario-loop-count-input').locator('input, textarea').first().inputValue();
  if (Number(count) !== 2) {
    throw new Error(`Loop count was not hydrated. Expected 2, got ${count}.`);
  }
  await page.getByTestId('api-scenario-list-editor-tab').click();

  row = page.getByTestId('api-scenario-row').filter({ hasText: loopScenarioName }).first();
  await row.locator('.api-scenario-management__row-main').click();
  await page.getByTestId('api-scenario-detail').waitFor({ timeout: 15000 });
  await page.keyboard.press('Escape');
  await page.locator('.arco-drawer:visible').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => undefined);

  const runResponse = page.waitForResponse((response) =>
    response.url().includes(`/api/automation/api/scenarios/${loopScenarioId}/run`) &&
    response.request().method() === 'POST' &&
    response.status() >= 200 &&
    response.status() < 300
  );
  await row.getByTestId('api-scenario-run').click();
  const response = await runResponse;
  const body = await response.json();
  const runData = body?.data || body;
  const childRunCount = (runData?.stepResults || []).filter((step) => step.stepName === loopChildName).length;
  if (childRunCount !== 2) {
    throw new Error(`Loop child should execute twice, got ${childRunCount}.`);
  }
  await page.getByTestId('api-run-result-step-row')
    .filter({ hasText: loopStepName })
    .filter({ hasText: 'Loop count: 2' })
    .waitFor({ timeout: 25000 });
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
  await openWorkbenchTab('场景');
  await page.getByTestId('api-scenario-management').waitFor({ timeout: 15000 });
  await cleanupByApi();

  await createIfScenarioInUi();
  await verifyIfScenarioHydrationAndRun();
  await createIfNotMatchedScenarioByApi();
  await createLoopScenarioInUi();
  await verifyLoopScenarioHydrationAndRun();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (overflow) {
    throw new Error('API scenario IF/LOOP controller page has horizontal overflow.');
  }

  await page.screenshot({ path: screenshotPath, fullPage: true });

  const requiredRequests = [
    ['/api/automation/api/scenarios', 'GET'],
    ['/api/automation/api/scenarios', 'POST'],
    ['/api/automation/api/scenarios/', 'POST']
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
      ifScenarioName,
      ifMatchedName,
      ifNotMatchedName,
      loopScenarioName,
      loopStepName,
      loopChildName,
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
      ifScenarioName,
      ifMatchedName,
      ifNotMatchedName,
      loopScenarioName,
      loopStepName,
      loopChildName,
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
