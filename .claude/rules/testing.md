---
paths:
  - "tests/**/*.ts"
  - "tests/**/*.spec.ts"
---

# Test Writing Rules

## Required for every test file

- Import `test` and `expect` from `@fixtures/site.fixture`, never from `@playwright/test`
- Tag every test with at least one: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- Use `test.describe('Description @tag', () => { ... })` to group and tag tests
- Never hardcode the base URL — use `siteConfig.url` from the fixture

## Assertions

- All `expect()` calls belong in test files, not in page object methods
- Use Playwright's built-in locator assertions (`toBeVisible`, `toHaveText`, etc.) over manual checks
- For soft assertions (warn but don't fail), log with `console.warn` and use `toBeLessThanOrEqual` with a generous threshold

## Waits

- Never use `page.waitForTimeout()` for more than 500ms — use auto-waiting
- For navigation: `await page.waitForLoadState('domcontentloaded')`
- For SPAs: `await page.waitForLoadState('networkidle')`
- For elements: Playwright's locator assertions auto-wait — just call `expect(locator).toBeVisible()`

## Form tests

- Never submit forms — no `submitBtn.click()` unless intercepting the POST and verifying it did NOT navigate
- Test field presence, type, required attributes, labels, and placeholders
- Use `form.locator('input[required]')` to find required fields, not CSS class guessing

## Test independence

- Each test must be runnable in isolation with `--grep <test-name>`
- Never rely on state left by a previous test
- Use `test.beforeEach` for setup, not `test.beforeAll` (shared state between tests)

## Skipping tests

- Use `test.skip(condition, 'reason')` when a site flag disables the feature
- Check `siteConfig.skipForms` before forms tests, `siteConfig.skipVisual` before visual tests
