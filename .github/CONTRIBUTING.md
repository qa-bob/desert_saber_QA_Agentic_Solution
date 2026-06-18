# Contributing to the Desert Saber QA Framework

Thank you for contributing. This guide covers everything you need to add tests, fix issues, and keep the suite healthy.

---

## Getting Started

```bash
# Fork and clone
git clone https://github.com/<your-fork>/desert_saber_QA_Agentic_Solution.git
cd desert_saber_QA_Agentic_Solution

# Install dependencies
npm install
npx playwright install --with-deps chromium

# Verify setup — run smoke tests
npm run test:smoke
```

All tests should pass before you begin making changes. If smoke tests fail, check [Troubleshooting](#troubleshooting) below.

---

## Branching

| Branch type | Naming convention | Example |
|---|---|---|
| New test | `test/<scope>-<feature>` | `test/functional-platform-page` |
| Bug fix | `fix/<what-is-broken>` | `fix/nav-mobile-selector` |
| Baseline update | `baseline/<reason>` | `baseline/after-site-redesign` |
| Framework change | `chore/<description>` | `chore/update-playwright-1.45` |

Always branch from `main`. Keep branches short-lived — one PR per topic.

---

## Writing Tests

### Step-by-step

1. **Read `site.config.json`** — understand the site URL and enabled flags
2. **Inspect the live site** — open `https://desertsaber.com` and find real selectors
3. **Add locators to the page object** — if the page class doesn't exist, create it in `src/pages/`
4. **Write the spec file** — import from `@fixtures/site.fixture`, tag every test
5. **Run `npm run typecheck`** — zero errors required
6. **Run your tests** — `npx playwright test tests/your-file.spec.ts`
7. **Open the report** — `npm run report`

### Test rules (non-negotiable)

- Tag every test with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- Never hardcode `https://desertsaber.com` — use `siteConfig.url`
- Never submit a form
- Never create an account or enter real credentials
- Never use `page.waitForTimeout()` for more than 500ms
- Never call `expect()` inside a page object method
- Always import `test` and `expect` from `@fixtures/site.fixture`, not `@playwright/test`

### Page Object guidelines

```typescript
// src/pages/my-new-page.page.ts
import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class MyNewPage extends BasePage {
  // ── Locators ───────────────────────────────────────────────────────────────
  readonly heading: Locator;

  constructor(page: import('@playwright/test').Page, config: import('@site-types/site-config.types').SiteConfig) {
    super(page, config);
    this.heading = page.locator('h1').first();
  }

  // ── Actions (no assertions here) ──────────────────────────────────────────
  async clickSomething(): Promise<void> {
    await this.page.getByRole('button', { name: /something/i }).click();
  }
}
```

Then add the fixture in `src/fixtures/site.fixture.ts` following the existing pattern.

---

## Visual Baseline Updates

If your change intentionally alters the site's appearance:

1. Run `npm run baseline` to capture new snapshots
2. Open each PNG in `__snapshots__/` and **visually verify** the change is correct
3. Add `__snapshots__/` changes to your PR with a comment explaining the visual change

Never commit baseline updates without reviewing the images — they exist to catch unintended regressions.

---

## Pull Request Process

1. Ensure `npm run typecheck` passes with zero errors
2. Ensure `npm run test:smoke` passes
3. Ensure your new tests pass: `npx playwright test tests/your-file.spec.ts`
4. Fill out the PR template completely
5. Add a test evidence screenshot or report excerpt in the PR description if relevant

PRs that fail typecheck or smoke tests will not be reviewed until fixed.

---

## Code Review Checklist

Reviewers check for:

- [ ] Tests are tagged correctly
- [ ] No hardcoded URLs
- [ ] No form submission code
- [ ] Page objects contain no assertions
- [ ] Selectors are role-based or use `data-testid` where possible
- [ ] TypeScript compiles cleanly
- [ ] Test names are descriptive and include the tag in the name

---

## Troubleshooting

**Smoke tests fail with "site unreachable"**
The site may be temporarily down. Re-run in a few minutes: `npm run test:smoke`.

**TypeScript errors after adding a page class**
Check the path alias is correct. Aliases are defined in `tsconfig.json`:
- `@pages/*` → `src/pages/*`
- `@fixtures/*` → `src/fixtures/*`
- `@utils/*` → `src/utils/*`
- `@site-types/*` → `src/types/*`

**Visual tests fail immediately**
Run `npm run baseline` first to create the initial snapshots.

**"Cannot find module '@fixtures/site.fixture'"**
You may be importing from `@playwright/test` instead of the custom fixture. Change to:
```typescript
import { test, expect } from '@fixtures/site.fixture';
```

---

## Getting Help

- Read [CLAUDE.md](../CLAUDE.md) for the complete framework rules
- See [Agent.md](../Agent.md) for AI agents that can generate tests for you
- Open an issue using the [test request template](ISSUE_TEMPLATE/test_request.md)
