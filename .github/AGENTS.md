# GitHub Copilot Agent Instructions — Desert Saber QA Framework

> These instructions apply to GitHub Copilot coding agents and Copilot Workspace.
> Claude Code uses `CLAUDE.md` in the project root instead.

---

## Project

Playwright + TypeScript regression test suite for https://desertsaber.com.
Architecture: **Page Object Model (POM)** with OOP inheritance. TypeScript strict mode enabled.

---

## Core Rules

### Never Do This

- Submit a form (the company receives real emails)
- Create accounts or enter real credentials
- Hardcode `https://desertsaber.com` in tests — use `siteConfig.url` from the fixture
- Add `expect()` calls inside page object classes
- Use `page.waitForTimeout()` for more than 500ms
- Use `any` type without explicit comment justification
- Import from `@playwright/test` directly in test files — use `@fixtures/site.fixture`

### Always Do This

- Tag every test: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, or `@responsive`
- Extend `BasePage` for every new page object class
- Declare locators as `readonly Locator` properties on the class
- Run `npx tsc --noEmit` before finishing
- Use `waitUntil: 'domcontentloaded'` for navigation (not `load` unless specifically needed)
- Use role-based selectors (`getByRole`, `getByLabel`) over CSS class selectors

---

## File Organization

| Path | What Goes Here |
|---|---|
| `src/pages/<name>.page.ts` | One class per page/section, extends BasePage |
| `src/fixtures/site.fixture.ts` | Custom `test` object — add new page fixtures here |
| `tests/<category>/<feature>.spec.ts` | Spec files — import from `@fixtures/site.fixture` |
| `tests/functional/` | Business logic tests — one file per page or feature area |

---

## Page Object Template

```typescript
import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class ExamplePage extends BasePage {
  readonly heading: Locator;
  readonly ctaButton: Locator;

  constructor(page: import('@playwright/test').Page, config: import('@site-types/site-config.types').SiteConfig) {
    super(page, config);
    this.heading = page.locator('h1').first();
    this.ctaButton = page.getByRole('link', { name: /get started/i }).first();
  }

  async clickCta(): Promise<void> {
    await this.ctaButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
```

## Test File Template

```typescript
import { test, expect } from '@fixtures/site.fixture';

test.describe('Feature Name @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url + '/path', { waitUntil: 'domcontentloaded' });
  });

  test('description of what is verified @functional', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

---

## Test Tags

| Tag | When to Use |
|---|---|
| `@smoke` | Site loads, title, no JS errors |
| `@navigation` | Nav links, routing, mobile menu |
| `@forms` | Form fields, validation |
| `@functional` | Business features, page content |
| `@visual` | `toHaveScreenshot()` comparisons |
| `@responsive` | Viewport-specific layout |
