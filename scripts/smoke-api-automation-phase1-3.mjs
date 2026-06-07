import { createRequire } from 'node:module';

const require = createRequire('D:/CodeProject/auto/web/package.json');
const { chromium } = require('playwright');

const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5173';
const username = process.env.SMOKE_USERNAME || 'superadmin';
const password = process.env.SMOKE_PASSWORD || 'superadmin123';
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const definitionName = `smoke-api-definition-${stamp}`;
const editedDefinitionName = `${definitionName}-edited`;
const caseName = `smoke-api-case-${stamp}`;
const screenshotPath = `output/playwright/api-automation-phase3b-${stamp}.png`;
const detailScreenshotPath = `output/playwright/api-automation-phase3h-editor-${stamp}.png`;
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
  return page.getByTestId(testId).locator('input:visible, textarea:visible').first();
}

async function clickRequestContentTab(index) {
  await page.getByTestId('api-definition-content-tabs').locator('.arco-tabs-tab').nth(index).click();
}

async function assertRequestEditorShell() {
  await page.getByTestId('api-definition-request-editor').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-editor-tabs').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-command-row').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-content-tabs').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-response-shell').waitFor({ timeout: 15000 });
  await assertRequestEditorPhase3H();
}

async function assertRequestEditorPhase3H() {
  await clickRequestContentTab(0);
  await page.getByTestId('api-definition-headers-editor').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-inline-header-key-input').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-header-row').first().waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-param-batch-add').first().waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-header-row').first().getByTestId('api-definition-param-type-select').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-header-row').first().getByTestId('api-definition-param-required-toggle').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-header-add-row').click();
  await page.getByTestId('api-definition-header-row').nth(1).waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-header-row').nth(1).getByTestId('api-definition-inline-header-key-input').locator('input').fill('X-Smoke-Extra');
  await page.getByTestId('api-definition-header-row').nth(1).getByTestId('api-definition-inline-header-value-input').locator('input').fill('phase3g');
  await assertBatchAddTools({
    addButtonTestId: 'api-definition-header-batch-add',
    rowTestId: 'api-definition-header-row',
    keyInputTestId: 'api-definition-inline-header-key-input',
    firstKey: 'X-Batch-One',
    secondKey: 'X-Batch-Two',
    thirdKey: 'X-Batch-Only'
  });

  await clickRequestContentTab(1);
  await page.getByTestId('api-definition-body-editor').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-body-mode-raw').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-body-mode-json').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-body-mode-text').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-body-mode-json').click();
  await page.getByTestId('api-definition-inline-body-input').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-body-mode-form').click();
  await page.getByTestId('api-definition-body-form-row').first().waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-body-form-row').first().getByTestId('api-definition-param-type-select').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-body-form-row').first().getByTestId('api-definition-param-required-toggle').click();
  await page.getByTestId('api-definition-body-form-row').first().getByTestId('api-definition-body-form-key-input').locator('input').fill('phase');
  await page.getByTestId('api-definition-body-form-row').first().getByTestId('api-definition-body-form-value-input').locator('input').fill('3g');
  await assertBatchAddTools({
    addButtonTestId: 'api-definition-body-form-batch-add',
    rowTestId: 'api-definition-body-form-row',
    keyInputTestId: 'api-definition-body-form-key-input',
    firstKey: 'bodyBatchOne',
    secondKey: 'bodyBatchTwo',
    thirdKey: 'bodyBatchOnly'
  });
  await page.getByTestId('api-definition-body-mode-raw').click();
  await page.getByTestId('api-definition-inline-body-input').waitFor({ timeout: 15000 });

  await clickRequestContentTab(2);
  await page.getByTestId('api-definition-params-editor').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-inline-query-key-input').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-query-row').first().waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-query-row').first().getByTestId('api-definition-param-encode-toggle').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-query-row').first().getByTestId('api-definition-param-min-length-input').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-query-row').first().getByTestId('api-definition-param-max-length-input').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-query-add-row').click();
  await page.getByTestId('api-definition-query-row').nth(1).waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-query-row').nth(1).getByTestId('api-definition-inline-query-key-input').locator('input').fill('phase');
  await page.getByTestId('api-definition-query-row').nth(1).getByTestId('api-definition-inline-query-value-input').locator('input').fill('3g');
  await assertBatchAddTools({
    addButtonTestId: 'api-definition-query-batch-add',
    rowTestId: 'api-definition-query-row',
    keyInputTestId: 'api-definition-inline-query-key-input',
    firstKey: 'queryBatchOne',
    secondKey: 'queryBatchTwo',
    thirdKey: 'queryBatchOnly'
  });

  await clickRequestContentTab(3);
  await page.getByTestId('api-definition-auth-editor').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-auth-type').waitFor({ timeout: 15000 });
  await clickRequestContentTab(4);
  await page.getByTestId('api-definition-pre-editor').waitFor({ timeout: 15000 });
  await clickRequestContentTab(5);
  await page.getByTestId('api-definition-post-editor').waitFor({ timeout: 15000 });
  await clickRequestContentTab(6);
  await page.getByTestId('api-definition-tests-editor').waitFor({ timeout: 15000 });
  await clickRequestContentTab(7);
  await page.getByTestId('api-definition-settings-editor').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-inline-timeout-input').waitFor({ timeout: 15000 });
  await clickRequestContentTab(8);
  await page.getByTestId('api-definition-cases-editor').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-cases-editor').getByTestId('api-case-management').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-cases-editor').getByTestId('api-case-create').click();
  await inputByTestId('api-case-name-input').fill(caseName);
  await inputByTestId('api-case-path-input').fill(smokeRequestUrl);
  await clickVisibleModalPrimaryButton();
  await page.getByTestId('api-definition-cases-editor').getByText(caseName).waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-cases-editor').getByTestId('api-case-list-density-shell').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-cases-editor').getByTestId('api-case-detail-entry').first().waitFor({ timeout: 15000 });
  await clickRequestContentTab(1);
  await page.getByTestId('api-definition-response-shell').waitFor({ timeout: 15000 });
}

async function assertBatchAddTools({ addButtonTestId, rowTestId, keyInputTestId, firstKey, secondKey, thirdKey }) {
  const initialRows = await page.getByTestId(rowTestId).count();
  await page.getByTestId(addButtonTestId).click();
  await page.getByTestId('api-definition-batch-add-drawer').waitFor({ timeout: 15000 });
  await page.getByTestId('api-definition-batch-add-input').locator('textarea').fill([
    `${firstKey}=alpha`,
    `${secondKey}: beta`,
    thirdKey
  ].join('\n'));
  await page.getByTestId('api-definition-batch-add-confirm').click();
  await page.getByTestId('api-definition-batch-add-drawer').waitFor({ state: 'hidden', timeout: 15000 });
  await page.waitForFunction(
    ({ testId, count }) => document.querySelectorAll(`[data-testid="${testId}"]`).length >= count + 3,
    { testId: rowTestId, count: initialRows },
    { timeout: 15000 }
  );
  await page.waitForFunction(
    ({ rowsTestId, inputTestId, expectedKeys }) => {
      const values = Array.from(document.querySelectorAll(`[data-testid="${rowsTestId}"] [data-testid="${inputTestId}"] input`))
        .map((input) => input instanceof HTMLInputElement ? input.value : '');
      return expectedKeys.every((key) => values.includes(key));
    },
    { rowsTestId: rowTestId, inputTestId: keyInputTestId, expectedKeys: [firstKey, secondKey, thirdKey] },
    { timeout: 15000 }
  );

  await page.getByTestId(`${addButtonTestId}-disable-all`).click();
  await page.waitForFunction(
    ({ switchRowTestId }) => {
      const rows = Array.from(document.querySelectorAll(`[data-testid="${switchRowTestId}"]`));
      return rows.length > 0 && rows.every((row) => !row.querySelector('.arco-switch')?.classList.contains('arco-switch-checked'));
    },
    { switchRowTestId: rowTestId },
    { timeout: 15000 }
  );
  await page.getByTestId(`${addButtonTestId}-enable-all`).click();
  await page.waitForFunction(
    ({ switchRowTestId }) => {
      const rows = Array.from(document.querySelectorAll(`[data-testid="${switchRowTestId}"]`));
      return rows.length > 0 && rows.every((row) => row.querySelector('.arco-switch')?.classList.contains('arco-switch-checked'));
    },
    { switchRowTestId: rowTestId },
    { timeout: 15000 }
  );

  const beforeClear = await page.getByTestId(rowTestId).count();
  const keyInputs = page.getByTestId(rowTestId).getByTestId(keyInputTestId).locator('input');
  await keyInputs.last().fill('');
  await page.getByTestId(`${addButtonTestId}-clear-empty`).click();
  await page.waitForFunction(
    ({ testId, count }) => document.querySelectorAll(`[data-testid="${testId}"]`).length < count,
    { testId: rowTestId, count: beforeClear },
    { timeout: 15000 }
  );
}

async function clickVisibleModalPrimaryButton() {
  await page.locator('.arco-modal:visible .arco-modal-footer .arco-btn-primary').last().click();
}

async function cleanupSmokeDefinitions() {
  await cleanupSmokeCasesByApi();
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

async function apiFetch(path, options = {}) {
  return page.evaluate(
    async ({ apiPath, requestOptions }) => {
      const response = await fetch(`/api${apiPath}`, {
        credentials: 'include',
        ...requestOptions
      });
      const text = await response.text();
      let body = null;

      try {
        body = text ? JSON.parse(text) : null;
      } catch {
        body = text;
      }

      if (!response.ok) {
        throw new Error(`${requestOptions.method || 'GET'} ${apiPath} failed with ${response.status}: ${text}`);
      }

      return body;
    },
    { apiPath: path, requestOptions: options }
  );
}

function pageItems(payload) {
  if (Array.isArray(payload?.data?.items)) {
    return payload.data.items;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

async function cleanupSmokeCasesByApi() {
  const payload = await apiFetch('/automation/api/cases');
  const cases = pageItems(payload).filter((item) =>
    String(item.name || '').startsWith('smoke-api-case-')
  );

  for (const item of cases) {
    await apiFetch(`/automation/api/cases/${item.id}`, { method: 'DELETE' }).catch(() => undefined);
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
  const detailOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);

  if (detailOverflow) {
    throw new Error('API automation request editor detail has horizontal overflow.');
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach((element) => {
      if (element instanceof HTMLElement) {
        element.scrollLeft = 0;
      }
    });
  });
  await page.screenshot({ path: detailScreenshotPath, fullPage: true });
}

async function deleteDefinition() {
  const row = page.locator('[data-testid="api-definition-row"]').filter({ hasText: editedDefinitionName }).first();

  await row.getByTestId('api-definition-delete').click();
  await clickVisibleModalPrimaryButton();
  await row.waitFor({ state: 'detached', timeout: 15000 });
}

async function deleteCreatedCase() {
  await cleanupSmokeCasesByApi();
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
  await deleteCreatedCase();
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
