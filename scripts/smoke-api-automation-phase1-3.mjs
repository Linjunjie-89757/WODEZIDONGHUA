import { createRequire } from 'node:module';

const require = createRequire('D:/CodeProject/auto/web/package.json');
const { chromium } = require('playwright');

const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5173';
const username = process.env.SMOKE_USERNAME || 'superadmin';
const password = process.env.SMOKE_PASSWORD || 'superadmin123';
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const definitionName = `smoke-api-definition-${stamp}`;
const editedDefinitionName = `${definitionName}-edited`;
const screenshotPath = `output/playwright/api-automation-phase3b-${stamp}.png`;
const detailScreenshotPath = `output/playwright/api-automation-phase3e-editor-${stamp}.png`;
const smokeRequestUrl = 'http://localhost:8080/api/auth/me';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const requests = [];
const consoleMessages = [];
const pageErrors = [];

page.on('response', (response) => {
  const url = response.url();

  if (
    url.includes('/api/auth') ||
    url.includes('/api/workspaces') ||
    url.includes('/api/automation/api')
  ) {
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
  await page.goto(`${baseUrl}/api-automation`, { waitUntil: 'networkidle' });

  if (page.url().includes('/login')) {
    await page.locator('input[type="text"]').fill(username);
    await page.locator('input[type="password"]').fill(password);
    await page.locator('form button').click();
  }

  await page.waitForURL('**/api-automation', { timeout: 15000 });
}

function endpointReturned(path, method = 'GET') {
  return requests.some((request) =>
    request.url.includes(`/api${path}`) &&
    request.method === method &&
    request.status >= 200 &&
    request.status < 300
  );
}

function inputByTestId(testId) {
  return page.getByTestId(testId).locator('input, textarea').first();
}

async function assertRequestEditorShell() {
  await page.getByTestId('api-definition-request-editor').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-editor-tabs').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-command-row').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-content-tabs').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-response-shell').waitFor({ timeout: 15000 });
  await assertRequestEditorPhase3E();
}

async function assertRequestEditorPhase3E() {
  await page.getByTestId('api-definition-content-tabs').locator('.arco-tabs-tab-title').filter({ hasText: '请求头' }).click();
  await page.getByTestId('api-definition-headers-editor').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-inline-header-key-input').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-content-tabs').locator('.arco-tabs-tab-title').filter({ hasText: '请求体' }).click();
  await page.getByTestId('api-definition-body-editor').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-inline-body-input').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-content-tabs').locator('.arco-tabs-tab-title').filter({ hasText: 'Params' }).click();
  await page.getByTestId('api-definition-params-editor').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-inline-query-key-input').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-content-tabs').locator('.arco-tabs-tab-title').filter({ hasText: 'Auth' }).click();
  await page.getByTestId('api-definition-auth-editor').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-auth-type').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-content-tabs').locator('.arco-tabs-tab-title').filter({ hasText: '前置处理' }).click();
  await page.getByTestId('api-definition-pre-editor').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-content-tabs').locator('.arco-tabs-tab-title').filter({ hasText: '后置处理' }).click();
  await page.getByTestId('api-definition-post-editor').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-content-tabs').locator('.arco-tabs-tab-title').filter({ hasText: '断言' }).click();
  await page.getByTestId('api-definition-tests-editor').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-content-tabs').locator('.arco-tabs-tab-title').filter({ hasText: '设置' }).click();
  await page.getByTestId('api-definition-settings-editor').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-inline-timeout-input').waitFor({ timeout: 15000 });
}

async function clickVisibleModalPrimaryButton() {
  await page.locator('.arco-modal:visible .arco-modal-footer .arco-btn-primary').last().click();
}

async function cleanupSmokeDefinitions() {
  const rows = page.locator('[data-testid="api-definition-row"]').filter({ hasText: 'smoke-api-definition-' });

  while ((await rows.count()) > 0) {
    const row = rows.first();

    await row.getByTestId('api-definition-delete').click();
    await clickVisibleModalPrimaryButton();
    await page.waitForResponse((response) =>
      response.url().includes('/api/automation/api/definitions/') &&
      response.request().method() === 'DELETE' &&
      response.status() >= 200 &&
      response.status() < 300
    );
    await row.waitFor({ state: 'detached', timeout: 15000 });
  }
}

async function fillDefinitionForm(name, path) {
  await inputByTestId('api-definition-name-input').fill(name);
  await page.getByTestId('api-definition-method-select').click();
  await page.locator('.arco-select-option').filter({ hasText: 'GET' }).first().click();
  await inputByTestId('api-definition-path-input').fill(path);
  await inputByTestId('api-definition-timeout-input').fill('10000');
  await inputByTestId('api-definition-query-key-input').fill('smoke');
  await inputByTestId('api-definition-query-value-input').fill('1');
  await inputByTestId('api-definition-header-key-input').fill('X-Smoke');
  await inputByTestId('api-definition-header-value-input').fill('true');
  await inputByTestId('api-definition-body-input').fill('');
}

async function addAssertion(optionIndex, configure) {
  await page.getByTestId('api-assertion-add').click();
  await page.locator('.arco-dropdown .arco-dropdown-option').nth(optionIndex).click();
  await configure();
}

async function fillAssertionConfig() {
  await addAssertion(0, async () => {
    await inputByTestId('api-assertion-code-expected').fill('401');
  });

  await addAssertion(1, async () => {
    await inputByTestId('api-assertion-header-name').fill('Content-Type');
    await inputByTestId('api-assertion-header-expected').fill('json');
  });

  await addAssertion(2, async () => {
    await inputByTestId('api-assertion-body-expression').fill('$.success');
    await inputByTestId('api-assertion-body-expected').fill('false');
  });

  await addAssertion(3, async () => {
    await inputByTestId('api-assertion-time-expected').fill('10000');
  });
}

async function createDefinition() {
  await page.getByTestId('api-definition-create').click();
  await fillDefinitionForm(definitionName, smokeRequestUrl);
  await fillAssertionConfig();
  await clickVisibleModalPrimaryButton();
  await page.getByText(definitionName).waitFor({ timeout: 15000 });
}

async function editDefinition() {
  const row = page.locator('[data-testid="api-definition-row"]').filter({ hasText: definitionName }).first();
  const detailResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/api/automation/api/definitions/') &&
    response.request().method() === 'GET' &&
    response.status() >= 200 &&
    response.status() < 300
  );

  await row.getByTestId('api-definition-edit').click();
  await detailResponsePromise;
  await page.getByTestId('api-definition-name-input').waitFor({ timeout: 15000 });

  await page.waitForFunction(
    (expectedName) => {
      const wrapper = document.querySelector('[data-testid="api-definition-name-input"]');
      const input = wrapper?.querySelector('input');
      return input?.value === expectedName;
    },
    definitionName,
    { timeout: 15000 }
  );

  const loadedPath = await inputByTestId('api-definition-path-input').inputValue();

  if (loadedPath !== smokeRequestUrl) {
    throw new Error('API definition detail was not loaded into the edit form.');
  }
  await page.getByTestId('api-assertion-item-RESPONSE_CODE').waitFor({ timeout: 15000 });
  await page.getByTestId('api-assertion-item-RESPONSE_HEADER').waitFor({ timeout: 15000 });
  await page.getByTestId('api-assertion-item-RESPONSE_BODY').waitFor({ timeout: 15000 });
  await page.getByTestId('api-assertion-item-RESPONSE_TIME').waitFor({ timeout: 15000 });

  await fillDefinitionForm(editedDefinitionName, smokeRequestUrl);
  await clickVisibleModalPrimaryButton();
  await page.getByText(editedDefinitionName).waitFor({ timeout: 15000 });
}

async function debugDefinition() {
  const row = page.locator('[data-testid="api-definition-row"]').filter({ hasText: editedDefinitionName }).first();

  await row.getByTestId('api-definition-debug').click();
  await assertRequestEditorShell();
  await page.waitForFunction(
    (expectedPath) => {
      const wrapper = document.querySelector('[data-testid="api-definition-inline-path-input"]');
      const input = wrapper?.querySelector('input');
      return input?.value === expectedPath;
    },
    smokeRequestUrl,
    { timeout: 15000 }
  );
  await page.getByTestId('api-debug-send').click();
  await page.getByTestId('api-definition-response-shell').getByTestId('api-run-result-panel').waitFor({ timeout: 20000 });
  await page.getByTestId('api-run-result-status').waitFor({ timeout: 20000 });
  await page.getByTestId('api-run-result-response-body').waitFor({ timeout: 20000 });
  await page.getByTestId('api-run-result-assertion-tab').click();
  await page.getByTestId('api-run-result-assertion-results').waitFor({ timeout: 20000 });
  await page.waitForFunction(() => {
    const panel = document.querySelector('[data-testid="api-run-result-assertion-results"]');
    return panel ? panel.querySelectorAll('.api-run-result-panel__item').length >= 4 : false;
  }, { timeout: 20000 });
  await page.screenshot({ path: detailScreenshotPath, fullPage: true });
}

async function deleteDefinition() {
  const row = page.locator('[data-testid="api-definition-row"]').filter({ hasText: editedDefinitionName }).first();

  await row.getByTestId('api-definition-delete').click();
  await clickVisibleModalPrimaryButton();
  await row.waitFor({ state: 'detached', timeout: 15000 });
}

try {
  await login();
  await page.getByTestId('api-automation-shell').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-list').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-modules').waitFor({ timeout: 15000 });
  await page.getByTestId('api-environment-select').waitFor({ timeout: 15000 });
  await page.getByTestId('api-variable-set-select').waitFor({ timeout: 15000 });

  await cleanupSmokeDefinitions();
  await createDefinition();
  await editDefinition();
  await debugDefinition();
  await deleteDefinition();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);

  if (overflow) {
    throw new Error('API automation page has horizontal overflow.');
  }

  await page.screenshot({ path: screenshotPath, fullPage: true });

  const requiredEndpoints = [
    ['/automation/api/definitions', 'GET'],
    ['/automation/api/definition-modules', 'GET'],
    ['/automation/api/environments', 'GET'],
    ['/automation/api/variable-sets', 'GET'],
    ['/automation/api/definitions', 'POST'],
    ['/automation/api/definitions', 'PUT'],
    ['/automation/api/definitions', 'DELETE'],
    ['/automation/api/definitions', 'POST_DEBUG']
  ];
  const missingEndpoint = requiredEndpoints.find(([path, method]) => {
    if (method === 'PUT') {
      return !requests.some((request) =>
        request.url.includes('/api/automation/api/definitions/') &&
        request.method === 'PUT' &&
        request.status >= 200 &&
        request.status < 300
      );
    }

    if (method === 'DELETE') {
      return !requests.some((request) =>
        request.url.includes('/api/automation/api/definitions/') &&
        request.method === 'DELETE' &&
        request.status >= 200 &&
        request.status < 300
      );
    }

    if (method === 'POST_DEBUG') {
      return !requests.some((request) =>
        request.url.includes('/api/automation/api/definitions/') &&
        request.url.includes('/debug-run') &&
        request.method === 'POST' &&
        request.status >= 200 &&
        request.status < 300
      );
    }

    return !endpointReturned(path, method);
  });

  if (missingEndpoint) {
    throw new Error(`Missing successful request ${missingEndpoint[1]} ${missingEndpoint[0]}`);
  }

  console.log(JSON.stringify(
    {
      status: 'pass',
      baseUrl,
      currentUrl: page.url(),
      definitionName,
      editedDefinitionName,
      screenshotPath,
      detailScreenshotPath,
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
      definitionName,
      editedDefinitionName,
      screenshotPath,
      detailScreenshotPath,
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
