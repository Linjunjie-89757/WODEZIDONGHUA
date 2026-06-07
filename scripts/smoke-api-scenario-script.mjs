import { createRequire } from 'node:module';

const require = createRequire('D:/CodeProject/auto/web/package.json');
const { chromium } = require('playwright');

const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5173';
const username = process.env.SMOKE_USERNAME || 'superadmin';
const password = process.env.SMOKE_PASSWORD || 'superadmin123';
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const scenarioName = `smoke-script-scenario-${stamp}`;
const scriptStepName = `smoke-script-step-${stamp}`;
const scriptContent = `log("script smoke ok"); setVar("scriptSmoke", "${stamp}");`;
const editedScriptContent = `log("script smoke edited"); setVar("scriptSmoke", "${stamp}-edited");`;
const screenshotPath = `output/playwright/api-scenario-script-${stamp}.png`;

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
    String(item.name || '').startsWith('smoke-script-scenario-')
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

function assertScriptStepPayload(payload, expectedScript, source) {
  const scriptStep = findStepByName(payload?.steps || [], scriptStepName);

  if (!scriptStep) {
    throw new Error(`${source} payload is missing script step ${scriptStepName}.`);
  }

  if (scriptStep.stepType !== 'SCRIPT') {
    throw new Error(`${source} script stepType should be SCRIPT, got ${scriptStep.stepType}.`);
  }

  if (scriptStep.script !== expectedScript) {
    throw new Error(`${source} script content was not persisted.`);
  }

  if (Array.isArray(scriptStep.children) && scriptStep.children.length > 0) {
    throw new Error(`${source} script step should not persist children.`);
  }

  const illegalStep = JSON.stringify(payload.steps).match(/"stepType"\s*:\s*"(GROUP|SCRIPT_CONTROLLER)"/);
  if (illegalStep) {
    throw new Error(`${source} payload contains unsupported stepType ${illegalStep[1]}.`);
  }
}

async function createScenarioWithScriptStep() {
  await page.getByTestId('api-scenario-create').click();
  await inputByTestId('api-scenario-name-input').fill(scenarioName);
  await page.getByTestId('api-scenario-step-editor').first().waitFor({ timeout: 15000 });
  await inputByTestId('api-scenario-custom-path-input').fill('http://localhost:8080/api/auth/me');

  await page.getByTestId('api-scenario-add-script-step').click();
  const scriptRow = page.locator('[data-testid="api-scenario-step-row"][data-step-type="SCRIPT"]').first();
  await scriptRow.waitFor({ timeout: 15000 });
  await scriptRow.getByTestId('api-scenario-step-name-input').locator('input, textarea').first().fill(scriptStepName);
  await scriptRow.getByTestId('api-scenario-script-input').locator('textarea, input').first().fill(scriptContent);
  await scriptRow.getByTestId('api-scenario-step-move-up').click();

  const createResponse = page.waitForResponse((response) =>
    response.url().includes('/api/automation/api/scenarios') &&
    response.request().method() === 'POST' &&
    response.status() >= 200 &&
    response.status() < 300
  );
  await clickVisibleModalPrimaryButton();
  await createResponse;
  await page.getByText(scenarioName).waitFor({ timeout: 15000 });
  assertScriptStepPayload(parsePayload(createScenarioPayload), scriptContent, 'create');
}

async function editScenarioAndVerifyScriptStep() {
  const row = page.getByTestId('api-scenario-row').filter({ hasText: scenarioName }).first();
  await row.getByTestId('api-scenario-edit').click();
  await page.getByTestId('api-scenario-step-editor').first().waitFor({ timeout: 15000 });

  const scriptRow = page.locator('[data-testid="api-scenario-step-row"][data-step-type="SCRIPT"]').first();
  await scriptRow.waitFor({ timeout: 15000 });

  const persistedName = await scriptRow.getByTestId('api-scenario-step-name-input').locator('input, textarea').first().inputValue();
  if (persistedName !== scriptStepName) {
    throw new Error(`Script step name was not hydrated. Expected ${scriptStepName}, got ${persistedName}.`);
  }

  const persistedScript = await scriptRow.getByTestId('api-scenario-script-input').locator('textarea, input').first().inputValue();
  if (persistedScript !== scriptContent) {
    throw new Error('Script content was not hydrated.');
  }

  await scriptRow.getByTestId('api-scenario-script-input').locator('textarea, input').first().fill(editedScriptContent);

  const updateResponse = page.waitForResponse((response) =>
    response.url().includes('/api/automation/api/scenarios/') &&
    response.request().method() === 'PUT' &&
    response.status() >= 200 &&
    response.status() < 300
  );
  await clickVisibleModalPrimaryButton();
  await updateResponse;
  await page.getByText(scenarioName).waitFor({ timeout: 15000 });
  assertScriptStepPayload(parsePayload(updateScenarioPayload), editedScriptContent, 'update');

  await row.getByTestId('api-scenario-edit').click();
  const reopenedScriptRow = page.locator('[data-testid="api-scenario-step-row"][data-step-type="SCRIPT"]').first();
  await reopenedScriptRow.waitFor({ timeout: 15000 });
  const reopenedScript = await reopenedScriptRow.getByTestId('api-scenario-script-input').locator('textarea, input').first().inputValue();

  if (reopenedScript !== editedScriptContent) {
    throw new Error('Script content was not persisted after reopen.');
  }

  await page.keyboard.press('Escape');
  await page.locator('.arco-modal:visible').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => undefined);
}

async function runScenarioAndVerifyScriptResult() {
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
  await page.getByTestId('api-scenario-run-result').getByTestId('api-run-result-processor-tab').waitFor({ timeout: 25000 });
  await page.getByTestId('api-scenario-run-result').getByTestId('api-run-result-processor-results').filter({ hasText: 'script smoke edited' }).waitFor({ timeout: 25000 });
  await page.getByTestId('api-run-result-step-row').filter({ hasText: scriptStepName }).waitFor({ timeout: 25000 });

  const runData = runScenarioBody?.data || runScenarioBody;
  const scriptResult = (runData?.stepResults || []).find((step) => step.stepName === scriptStepName);

  if (!scriptResult) {
    throw new Error('Run response does not include an independent script step result.');
  }

  const processorResult = (scriptResult.processorResults || []).find((item) =>
    String(item.message || item.output || '').includes('script smoke edited')
  );

  if (!processorResult) {
    throw new Error('Script run result does not include processor output.');
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

  await createScenarioWithScriptStep();
  await editScenarioAndVerifyScriptStep();
  await runScenarioAndVerifyScriptResult();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (overflow) {
    throw new Error('API scenario script controller page has horizontal overflow.');
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
      scriptStepName,
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
      scriptStepName,
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
