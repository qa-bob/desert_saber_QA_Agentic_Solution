# Desert Saber — QA Agentic Solution

Playwright + TypeScript regression test suite for [Desert Saber](https://desertsaber.com) — a virtual training and simulation platform. Built with a **Page Object Model (POM)** architecture and designed for agentic execution via Claude Code.

---

## What This Repo Does

This framework provides automated GUI, functional, and regression coverage for `https://desertsaber.com` without creating accounts, submitting forms, or requiring credentials. It runs across desktop, tablet, and mobile viewports.

| Coverage Area | Tag | What Gets Tested |
|---|---|---|
| Smoke | `@smoke` | Site loads, HTTPS, title, no JS errors |
| Navigation | `@navigation` | Nav links, mobile menu, logo, no 404s |
| Forms | `@forms` | Field presence, labels, HTML5 validation |
| Functional | `@functional` | Hero, CTAs, feature sections, page content |
| Visual | `@visual` | Screenshot regression at 3 viewports |
| Responsive | `@responsive` | No horizontal overflow, font size, alt text |

---

## Tech Stack

| Tool | Role |
|---|---|
| [Playwright](https://playwright.dev/) | Browser automation |
| TypeScript (strict) | Type-safe test code |
| Page Object Model | Decoupled selectors from test logic |
| GitHub Actions | CI/CD pipeline |
| Claude Code | Agentic test generation and analysis |

---

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Git

---

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/<org>/desert_saber_QA_Agentic_Solution.git
cd desert_saber_QA_Agentic_Solution

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install --with-deps chromium

# 4. Verify the configuration
cat site.config.json
```

The site URL and test flags are controlled entirely by `site.config.json`. You should not need to modify any other configuration file.

---

## Running Tests

```bash
# Run all tests
npm test

# Run by category
npm run test:smoke          # @smoke — fast CI gate
npm run test:navigation     # @navigation
npm run test:forms          # @forms
npm run test:visual         # @visual — requires baseline snapshots
npm run test:responsive     # @responsive

# Open the interactive Playwright UI
npm run test:headed

# View the HTML report after a run
npm run report
```

### Visual baseline (first-time setup)

Visual tests compare against stored PNG snapshots. Before running `@visual` tests, capture baselines:

```bash
npm run baseline
```

Baselines are stored in `__snapshots__/`. Review each image before committing — see [Skills & Commands](Skills.md) for the `/update-baseline` command.

---

## Project Structure

```
desert_saber_QA_Agentic_Solution/
├── site.config.json              # Target URL, flags, auth settings
├── playwright.config.ts          # Playwright projects (desktop/mobile/tablet)
├── global-setup.ts               # Pre-suite reachability check
├── tsconfig.json                 # TypeScript config with path aliases
│
├── src/
│   ├── pages/                    # Page Object Model classes
│   │   ├── base.page.ts          # BasePage — shared helpers
│   │   ├── home.page.ts          # HomePage
│   │   ├── navigation.page.ts    # NavigationPage
│   │   └── contact.page.ts       # ContactFormPage
│   ├── fixtures/
│   │   └── site.fixture.ts       # Extended test object with page objects
│   ├── utils/
│   │   ├── link-checker.ts       # HTTP link reachability helpers
│   │   └── visual-helper.ts      # Cookie banner dismissal, screenshot prep
│   └── types/
│       └── site-config.types.ts  # SiteConfig interface + loader
│
├── tests/
│   ├── smoke/                    # @smoke
│   ├── navigation/               # @navigation
│   ├── forms/                    # @forms
│   ├── functional/               # @functional — business logic
│   ├── visual/                   # @visual — screenshot regression
│   └── responsive/               # @responsive
│
├── .claude/
│   ├── agents/                   # Claude Code sub-agent definitions
│   ├── commands/                 # Slash command definitions
│   └── rules/                    # Path-scoped instruction files
│
└── .github/
    ├── AGENTS.md                 # GitHub Copilot coding instructions
    ├── copilot-instructions.md   # GitHub Copilot chat instructions
    ├── CONTRIBUTING.md           # Contributor guidelines
    ├── PULL_REQUEST_TEMPLATE.md
    ├── ISSUE_TEMPLATE/
    └── workflows/
        └── playwright.yml        # CI/CD pipeline
```

---

## Architecture: POM + OOP

### Page Object Model

Every page or major section has a dedicated class in `src/pages/`. These classes:

- Extend `BasePage` (OOP inheritance)
- Declare locators as `readonly Locator` properties
- Expose methods for user actions — never assertions
- Are instantiated and injected via the custom fixture, not constructed in tests

```typescript
// Good — test uses the page object
test('hero heading is visible', async ({ homePage }) => {
  const heading = await homePage.getMainHeading();
  expect(heading).toBeTruthy();
});

// Bad — raw locator in test body
test('hero heading is visible', async ({ page }) => {
  await expect(page.locator('h1')).toBeVisible();
});
```

### OOP Principles Applied

| Principle | Implementation |
|---|---|
| Inheritance | All page classes extend `BasePage` |
| Encapsulation | Locators are `readonly`; internals are `private` |
| Single Responsibility | One class per page/section |
| Open/Closed | New pages extend `BasePage` without modifying it |

### Import Path Aliases

TypeScript path aliases are configured in `tsconfig.json`:

```typescript
import { test, expect } from '@fixtures/site.fixture';
import { HomePage } from '@pages/home.page';
import { SiteConfig } from '@site-types/site-config.types';
```

---

## AI Agents

This repo includes Claude Code sub-agents and slash commands for agentic workflows. See [Agent.md](Agent.md) for a full description.

| Agent | When to Invoke |
|---|---|
| `site-analyzer` | Populate `site.config.json` from a live site |
| `test-generator` | Generate site-specific tests for new pages/features |

Invoke via slash commands (see [Skills.md](Skills.md)):

```
/analyze-site
/generate-full-suite
/run-smoke
```

---

## GitHub Folder

The `.github/` folder contains repository governance and CI/CD:

| File/Dir | Purpose |
|---|---|
| `AGENTS.md` | Instructions for GitHub Copilot coding agents |
| `copilot-instructions.md` | GitHub Copilot chat customization |
| `CONTRIBUTING.md` | Contribution process and code standards |
| `PULL_REQUEST_TEMPLATE.md` | Checklist applied to all PRs |
| `ISSUE_TEMPLATE/bug_report.md` | Template for reporting test failures |
| `ISSUE_TEMPLATE/test_request.md` | Template for requesting new test coverage |
| `workflows/playwright.yml` | GitHub Actions CI pipeline |

---

## Contributor Rules

1. **Always read `site.config.json` first** — never hardcode the URL
2. **Use the custom fixture** — import `{ test, expect }` from `@fixtures/site.fixture`, not `@playwright/test`
3. **Tag every test** — at minimum one of `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
4. **No form submission** — test field presence and validation only
5. **No accounts or credentials** — `auth.required` in config controls this; default is `false`
6. **No assertions in page objects** — all `expect()` calls belong in spec files
7. **No `waitForTimeout()`** — use Playwright's auto-waiting or `waitForSelector`
8. **No `any` types** — strict TypeScript is enforced
9. **Run typecheck before PR** — `npm run typecheck` must pass with zero errors
10. **One page class per page** — add a new class in `src/pages/` for every new page under test
11. **Test independence** — each test must be runnable in isolation; no shared state between tests
12. **Visual baselines** — run `npm run baseline` after intentional design changes; review images before committing

---

## CI/CD

Tests run automatically on every push and pull request via GitHub Actions. The pipeline:

1. Installs Node.js and Playwright browsers
2. Runs `@smoke` tests first as a fast gate
3. Runs the full suite in parallel across Chromium desktop, mobile Chrome, and tablet
4. Uploads the HTML report as a downloadable artifact on failure

See `.github/workflows/playwright.yml` for the full configuration.

---

## Company Profile

| Field | Details |
|---|---|
| Company | Desert Saber, LLC |
| Website | https://desertsaber.com |
| Product | Virtual training & simulation (Conundrum™ Platform) |
| Industry | Training & Simulation / Industrial EdTech |
| Founded | 2017 |
| Location | Tucson, AZ |
| CEO | Mary Poulton |
| Engineering | Michael Peltier (Director) |
