import { createRequire } from 'node:module';

const require = createRequire('D:/CodeProject/auto/web/package.json');
const { chromium } = require('playwright');

const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5173';
const username = process.env.SMOKE_USERNAME || 'superadmin';
const password = process.env.SMOKE_PASSWORD || 'superadmin123';
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const scenarioName = `smoke-wait-scenario-${stamp}`;
const waitStepName = `smoke-wait-step-${stamp}`;
const deletedWaitStepName = `smoke-wait-delete-${stamp}`;
const waitDelayMs = '50';
const editedRequestUrl = 'http://localhost:8080/api/workspaces/switchable';
const screenshotPath = `output/playwright/api-scenario-wait-${stamp}.png`;

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
    const item = {
      method: response.request().method(),
      url,
      status: response.status()
    };
    requests.push(item);

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
    String(item.name || '').startsWith('smoke-wait-scenario-')
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

function assertWaitStepPayload(payload, source) {
  const waitStep = findStepByName(payload?.steps || [], waitStepName);

  if (!waitStep) {
    throw new Error(`${source} payload is missing wait step ${waitStepName}.`);
  }

  if (waitStep.stepType !== 'CONSTANT_TIMER') {
    throw new Error(`${source} wait stepType should be CONSTANT_TIMER, got ${waitStep.stepType}.`);
  }

  if (Number(waitStep.delayMs) !== Number(waitDelayMs)) {
    throw new Error(`${source} wait delayMs should be ${waitDelayMs}, got ${waitStep.delayMs}.`);
  }

  if (Array.isArray(waitStep.children) && waitStep.children.length > 0) {
    throw new Error(`${source} wait step should not persist children.`);
  }

  const illegalStep = JSON.stringify(payload.steps).match(/"stepType"\s*:\s*"(GROUP|WAIT_CONTROLLER)"/);
  if (illegalStep) {
    throw new Error(`${source} payload contains unsupported stepType ${illegalStep[1]}.`);
  }
}

async function createScenarioWithWaitStep() {
  await page.getByTestId('api-scenario-create').click();
  await inputByTestId('api-scenario-name-input').fill(scenarioName);
  await page.getByTestId('api-scenario-step-editor').first().waitFor({ timeout: 15000 });
  await inputByTestId('api-scenario-custom-path-input').fill('http://localhost:8080/api/auth/me');

  await page.getByTestId('api-scenario-add-wait-step').click();
  await page.getByTestId('api-scenario-add-wait-step').click();

  const waitRows = page.locator('[data-testid="api-scenario-step-row"][data-step-type="CONSTANT_TIMER"]');
  await waitRows.nth(0).getByTestId('api-scenario-step-name-input').locator('input, textarea').first().fill(deletedWaitStepName);
  await waitRows.nth(1).getByTestId('api-scenario-step-name-input').locator('input, textarea').first().fill(waitStepName);
  await waitRows.nth(1).getByTestId('api-scenario-wait-delay-input').locator('input, textarea').first().fill(waitDelayMs);

  await waitRows.nth(1).getByTestId('api-scenario-step-move-up').click();
  const waitRowCount = await page.locator('[data-testid="api-scenario-step-row"][data-step-type="CONSTANT_TIMER"]').count();
  let deleted = false;

  for (let index = 0; index < waitRowCount; index += 1) {
    const row = page.locator('[data-testid="api-scenario-step-row"][data-step-type="CONSTANT_TIMER"]').nth(index);
    const name = await row.getByTestId('api-scenario-step-name-input').locator('input, textarea').first().inputValue();

    if (name === deletedWaitStepName) {
      await row.getByTestId('api-scenario-step-delete').click();
      deleted = true;
      break;
    }
  }

  if (!deleted) {
    throw new Error(`Could not find wait step to delete: ${deletedWaitStepName}.`);
  }

  const createResponse = page.waitForResponse((response) =>
    response.url().includes('/api/automation/api/scenarios') &&
    response.request().method() === 'POST' &&
    response.status() >= 200 &&
    response.status() < 300
  );
  await clickVisibleModalPrimaryButton();
  await createResponse;
  await page.getByText(scenarioName).waitFor({ timeout: 15000 });
  assertWaitStepPayload(parsePayload(createScenarioPayload), 'create');
}

async function editScenarioAndVerifyWaitStep() {
  const row = page.getByTestId('api-scenario-row').filter({ hasText: scenarioName }).first();
  await row.getByTestId('api-scenario-edit').click();
  await page.getByTestId('api-scenario-step-editor').first().waitFor({ timeout: 15000 });

  const waitRow = page.locator('[data-testid="api-scenario-step-row"][data-step-type="CONSTANT_TIMER"]').first();
  await waitRow.waitFor({ timeout: 15000 });

  const persistedName = await waitRow.getByTestId('api-scenario-step-name-input').locator('input, textarea').first().inputValue();
  if (persistedName !== waitStepName) {
    throw new Error(`Wait step name was not hydrated. Expected ${waitStepName}, got ${persistedName}.`);
  }

  const persistedDelay = await waitRow.getByTestId('api-scenario-wait-delay-input').locator('input, textarea').first().inputValue();
  if (Number(persistedDelay) !== Number(waitDelayMs)) {
    throw new Error(`Wait delay was not hydrated. Expected ${waitDelayMs}, got ${persistedDelay}.`);
  }

  const customStep = page.locator('[data-testid="api-scenario-step-row"][data-step-type="CUSTOM_REQUEST"]').first();
  await customStep.getByTestId('api-scenario-custom-path-input').locator('input, textarea').first().fill(editedRequestUrl);

  const waitMoveDown = waitRow.getByTestId('api-scenario-step-move-down');
  const waitMoveUp = waitRow.getByTestId('api-scenario-step-move-up');

  if (await waitMoveDown.isEnabled()) {
    await waitMoveDown.click();
    await page.locator('[data-testid="api-scenario-step-row"][data-step-type="CONSTANT_TIMER"]').first().getByTestId('api-scenario-step-move-up').click();
  } else if (await waitMoveUp.isEnabled()) {
    await waitMoveUp.click();
    await page.locator('[data-testid="api-scenario-step-row"][data-step-type="CONSTANT_TIMER"]').first().getByTestId('api-scenario-step-move-down').click();
  } else {
    throw new Error('Wait step sorting controls are both disabled.');
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
  assertWaitStepPayload(parsePayload(updateScenarioPayload), 'update');

  await row.getByTestId('api-scenario-edit').click();
  const reopenedWaitRow = page.locator('[data-testid="api-scenario-step-row"][data-step-type="CONSTANT_TIMER"]').first();
  await reopenedWaitRow.waitFor({ timeout: 15000 });
  const reopenedWaitName = await reopenedWaitRow.getByTestId('api-scenario-step-name-input').locator('input, textarea').first().inputValue();
  if (reopenedWaitName !== waitStepName) {
    throw new Error(`Wait step name was not persisted after reopen. Expected ${waitStepName}, got ${reopenedWaitName}.`);
  }
  await page.keyboard.press('Escape');
  await page.locator('.arco-modal:visible').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => undefined);
}

async function runScenarioAndVerifyWaitResult() {
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
  await page.getByTestId('api-run-result-step-row').filter({ hasText: waitStepName }).waitFor({ timeout: 25000 });

  const runData = runScenarioBody?.data || runScenarioBody;
  const waitResult = (runData?.stepResults || []).find((step) => step.stepName === waitStepName);

  if (!waitResult) {
    throw new Error('Run response does not include an independent wait step result.');
  }

  if (Number(waitResult.durationMs) < 1) {
    throw new Error(`Wait result duration should be positive, got ${waitResult.durationMs}.`);
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

  await createScenarioWithWaitStep();
  await editScenarioAndVerifyWaitStep();
  await runScenarioAndVerifyWaitResult();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (overflow) {
    throw new Error('API scenario wait controller page has horizontal overflow.');
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
      waitStepName,
      waitDelayMs,
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
      waitStepName,
      waitDelayMs,
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
