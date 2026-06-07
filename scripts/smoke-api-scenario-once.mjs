import { createRequire } from 'node:module';

const require = createRequire('D:/CodeProject/auto/web/package.json');
const { chromium } = require('playwright');

const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5173';
const username = process.env.SMOKE_USERNAME || 'superadmin';
const password = process.env.SMOKE_PASSWORD || 'superadmin123';
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const scenarioName = `smoke-once-scenario-${stamp}`;
const onceStepName = `smoke-once-step-${stamp}`;
const childStepName = `smoke-once-child-${stamp}`;
const deletedChildName = `smoke-once-delete-${stamp}`;
const childRequestUrl = 'http://localhost:8080/api/auth/me';
const editedChildRequestUrl = 'http://localhost:8080/api/workspaces/switchable';
const screenshotPath = `output/playwright/api-scenario-once-${stamp}.png`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const requests = [];
const failedResponses = [];
const consoleMessages = [];
const pageErrors = [];
let createScenarioPayload = null;
let updateScenarioPayload = null;
let runScenarioBody = null;

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
      createScenarioPayload = response.request().postData();
    }

    if (
      url.includes('/api/automation/api/scenarios') &&
      !url.includes('/run') &&
      response.request().method() === 'PUT'
    ) {
      updateScenarioPayload = response.request().postData();
    }

    if (
      url.includes('/api/automation/api/scenarios') &&
      url.includes('/run') &&
      response.request().method() === 'POST'
    ) {
      response.json().then((body) => {
        runScenarioBody = body;
      }).catch(() => undefined);
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
    String(item.name || '').startsWith('smoke-once-scenario-')
  );

  for (const scenario of scenarios) {
    await apiFetch(`/automation/api/scenarios/${scenario.id}`, { method: 'DELETE' });
  }
}

function parsePayload(payload) {
  return payload ? JSON.parse(payload) : null;
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

function assertOnceStepPayload(payload, expectedChildUrl, source) {
  const onceStep = findStepByName(payload?.steps || [], onceStepName);

  if (!onceStep) {
    throw new Error(`${source} payload is missing once-only step ${onceStepName}.`);
  }

  if (onceStep.stepType !== 'ONCE_ONLY_CONTROLLER') {
    throw new Error(`${source} once-only stepType should be ONCE_ONLY_CONTROLLER, got ${onceStep.stepType}.`);
  }

  if (!Array.isArray(onceStep.children) || onceStep.children.length !== 1) {
    throw new Error(`${source} once-only step should persist exactly one child step.`);
  }

  const childStep = onceStep.children[0];
  if (childStep.stepType !== 'CUSTOM_REQUEST') {
    throw new Error(`${source} child stepType should be CUSTOM_REQUEST, got ${childStep.stepType}.`);
  }

  if (childStep.requestConfig?.path !== expectedChildUrl) {
    throw new Error(`${source} child request path was not persisted.`);
  }

  const illegalStep = JSON.stringify(payload.steps).match(/"stepType"\s*:\s*"(GROUP|ONCE_CONTROLLER|ONCE_ONLY)"/);
  if (illegalStep) {
    throw new Error(`${source} payload contains unsupported stepType ${illegalStep[1]}.`);
  }
}

async function fillChildCustomRequest(row, name, path) {
  await row.getByTestId('api-scenario-step-name-input').locator('input, textarea').first().fill(name);
  await row.getByTestId('api-scenario-custom-path-input').locator('input, textarea').first().fill(path);
}

async function createScenarioWithOnceStep() {
  await page.getByTestId('api-scenario-create').click();
  await inputByTestId('api-scenario-name-input').fill(scenarioName);
  await page.getByTestId('api-scenario-step-editor').first().waitFor({ timeout: 15000 });
  await inputByTestId('api-scenario-custom-path-input').fill('http://localhost:8080/api/auth/me');

  await page.getByTestId('api-scenario-add-once-step').click();
  const onceRow = page.locator('[data-testid="api-scenario-step-row"][data-step-type="ONCE_ONLY_CONTROLLER"]').first();
  await onceRow.waitFor({ timeout: 15000 });
  await onceRow.getByTestId('api-scenario-step-name-input').locator('input, textarea').first().fill(onceStepName);

  await onceRow.getByTestId('api-scenario-add-child-custom-step').click();
  await onceRow.getByTestId('api-scenario-add-child-custom-step').click();

  const childRows = onceRow.locator('[data-testid="api-scenario-step-row"][data-depth="1"][data-step-type="CUSTOM_REQUEST"]');
  await fillChildCustomRequest(childRows.nth(0), deletedChildName, childRequestUrl);
  await fillChildCustomRequest(childRows.nth(1), childStepName, childRequestUrl);
  await childRows.nth(1).getByTestId('api-scenario-step-move-up').click();

  const currentChildRows = onceRow.locator('[data-testid="api-scenario-step-row"][data-depth="1"][data-step-type="CUSTOM_REQUEST"]');
  const childCount = await currentChildRows.count();
  let deleted = false;

  for (let index = 0; index < childCount; index += 1) {
    const childRow = currentChildRows.nth(index);
    const name = await childRow.getByTestId('api-scenario-step-name-input').locator('input, textarea').first().inputValue();

    if (name === deletedChildName) {
      await childRow.getByTestId('api-scenario-step-delete').click();
      deleted = true;
      break;
    }
  }

  if (!deleted) {
    throw new Error(`Could not find child step to delete: ${deletedChildName}.`);
  }

  await onceRow.getByTestId('api-scenario-step-move-up').first().click();

  const createResponse = page.waitForResponse((response) =>
    response.url().includes('/api/automation/api/scenarios') &&
    response.request().method() === 'POST' &&
    response.status() >= 200 &&
    response.status() < 300
  );
  await clickVisibleModalPrimaryButton();
  await createResponse;
  await page.getByText(scenarioName).waitFor({ timeout: 15000 });
  assertOnceStepPayload(parsePayload(createScenarioPayload), childRequestUrl, 'create');
}

async function editScenarioAndVerifyOnceStep() {
  const row = page.getByTestId('api-scenario-row').filter({ hasText: scenarioName }).first();
  await row.getByTestId('api-scenario-edit').click();
  await page.getByTestId('api-scenario-step-editor').first().waitFor({ timeout: 15000 });

  const onceRow = page.locator('[data-testid="api-scenario-step-row"][data-step-type="ONCE_ONLY_CONTROLLER"]').first();
  await onceRow.waitFor({ timeout: 15000 });

  const persistedName = await onceRow.getByTestId('api-scenario-step-name-input').locator('input, textarea').first().inputValue();
  if (persistedName !== onceStepName) {
    throw new Error(`Once-only step name was not hydrated. Expected ${onceStepName}, got ${persistedName}.`);
  }

  const childRow = onceRow.locator('[data-testid="api-scenario-step-row"][data-depth="1"][data-step-type="CUSTOM_REQUEST"]').first();
  await childRow.waitFor({ timeout: 15000 });

  const persistedChildName = await childRow.getByTestId('api-scenario-step-name-input').locator('input, textarea').first().inputValue();
  if (persistedChildName !== childStepName) {
    throw new Error(`Once-only child step name was not hydrated. Expected ${childStepName}, got ${persistedChildName}.`);
  }

  await childRow.getByTestId('api-scenario-custom-path-input').locator('input, textarea').first().fill(editedChildRequestUrl);

  const onceMoveDown = onceRow.getByTestId('api-scenario-step-move-down').first();
  const onceMoveUp = onceRow.getByTestId('api-scenario-step-move-up').first();

  if (await onceMoveDown.isEnabled()) {
    await onceMoveDown.click();
    await page.locator('[data-testid="api-scenario-step-row"][data-step-type="ONCE_ONLY_CONTROLLER"]').first().getByTestId('api-scenario-step-move-up').first().click();
  } else if (await onceMoveUp.isEnabled()) {
    await onceMoveUp.click();
    await page.locator('[data-testid="api-scenario-step-row"][data-step-type="ONCE_ONLY_CONTROLLER"]').first().getByTestId('api-scenario-step-move-down').first().click();
  } else {
    throw new Error('Once-only step sorting controls are both disabled.');
  }

  const updateResponse = page.waitForResponse((response) =>
    response.url().includes('/api/automation/api/scenarios/') &&
    response.request().method() === 'PUT' &&
    response.status() >= 200 &&
    response.status() < 300
  );
  await clickVisibleModalPrimaryButton();
  await updateResponse;
  await page.getByText(scenarioName).waitFor({ timeout: 15000 });
  assertOnceStepPayload(parsePayload(updateScenarioPayload), editedChildRequestUrl, 'update');

  await row.getByTestId('api-scenario-edit').click();
  const reopenedOnceRow = page.locator('[data-testid="api-scenario-step-row"][data-step-type="ONCE_ONLY_CONTROLLER"]').first();
  await reopenedOnceRow.waitFor({ timeout: 15000 });
  const reopenedChildRow = reopenedOnceRow.locator('[data-testid="api-scenario-step-row"][data-depth="1"][data-step-type="CUSTOM_REQUEST"]').first();
  await reopenedChildRow.waitFor({ timeout: 15000 });
  const reopenedPath = await reopenedChildRow.getByTestId('api-scenario-custom-path-input').locator('input, textarea').first().inputValue();

  if (reopenedPath !== editedChildRequestUrl) {
    throw new Error('Once-only child custom path was not persisted after reopen.');
  }

  await page.keyboard.press('Escape');
  await page.locator('.arco-modal:visible').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => undefined);
}

async function runScenarioAndVerifyOnceResult() {
  const row = page.getByTestId('api-scenario-row').filter({ hasText: scenarioName }).first();
  const runResponse = page.waitForResponse((response) =>
    response.url().includes('/api/automation/api/scenarios/') &&
    response.url().includes('/run') &&
    response.request().method() === 'POST' &&
    response.status() >= 200 &&
    response.status() < 300
  );
  await row.getByTestId('api-scenario-run').click();
  await runResponse;
  await row.click();
  await page.getByTestId('api-scenario-run-result').waitFor({ timeout: 25000 });
  await page.getByTestId('api-scenario-run-result').getByTestId('api-run-result-panel').waitFor({ timeout: 25000 });
  await page.getByTestId('api-scenario-run-result').getByTestId('api-run-result-steps').waitFor({ timeout: 25000 });
  await page.getByTestId('api-run-result-step-row').filter({ hasText: onceStepName }).waitFor({ timeout: 25000 });

  const runData = runScenarioBody?.data || runScenarioBody;
  const onceResult = (runData?.stepResults || []).find((step) => step.stepName === onceStepName);

  if (!onceResult) {
    throw new Error('Run response does not include an independent once-only controller result.');
  }
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
  await page.getByTestId('api-scenario-management').waitFor({ timeout: 15000 });
  await cleanupByApi();

  await createScenarioWithOnceStep();
  await editScenarioAndVerifyOnceStep();
  await runScenarioAndVerifyOnceResult();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (overflow) {
    throw new Error('API scenario once-only controller page has horizontal overflow.');
  }

  await page.screenshot({ path: screenshotPath, fullPage: true });

  const requiredRequests = [
    ['/api/automation/api/scenarios', 'GET'],
    ['/api/automation/api/scenarios', 'POST'],
    ['/api/automation/api/scenarios/', 'PUT'],
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
      scenarioName,
      onceStepName,
      childStepName,
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
      scenarioName,
      onceStepName,
      childStepName,
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
