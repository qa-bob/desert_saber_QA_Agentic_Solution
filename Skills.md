# Skills.md — Skills & Commands

This document describes every skill (slash command) available in this Claude Code project. Skills are invoked by typing `/skill-name` in a Claude Code session.

---

## Quick Reference

| Command | What It Does | When to Use |
|---|---|---|
| `/analyze-site [url]` | Inspect the live site and update `site.config.json` | Before writing tests; after a site redesign |
| `/generate-full-suite` | Generate all POM classes and test files from scratch | New site onboarding; full coverage refresh |
| `/run-smoke` | Run `@smoke` tests and show a pass/fail table | Quick health check; CI triage |
| `/update-baseline` | Capture new visual regression baseline screenshots | After intentional design changes |
| `/generate-report` | Parse results and display a structured summary | After any test run |

---

## `/analyze-site`

**File:** `.claude/commands/analyze-site.md`

Navigates to the site (or uses the URL in `site.config.json`) and produces a complete, populated config JSON.

### Usage

```
/analyze-site
/analyze-site https://desertsaber.com
```

### What it inspects

- Page `<title>` and `<meta name="description">` content
- Primary navigation: all link text and hrefs
- Presence of `<form>` elements (especially those with email fields)
- H1/main heading text
- Primary CTA button text and targets
- Whether the site loads over HTTPS
- Contact form presence (checks `/contact`, `/contact-us`, `/get-in-touch`)
- Responsiveness at 390px viewport

### Output

A `site.config.json` JSON block + an issues checklist:

```json
{
  "name": "Desert Saber",
  "url": "https://desertsaber.com",
  "hasContactForm": true,
  "expectedNavItems": ["Home", "Platform", "Contact Us"],
  ...
}
```

### Edge cases handled

- SPAs: waits for `networkidle` + 2s for hydration
- Auth-gated sites: sets `auth.required: true`
- Cookie banners: dismissed before inspection
- Redirect chains: uses final canonical URL

---

## `/generate-full-suite`

**File:** `.claude/commands/generate-full-suite.md`

Analyzes the live site and generates the complete test suite: POM classes for every discoverable page, fixture updates, and spec files for all six test categories.

### Usage

```
/generate-full-suite
```

### What it generates

1. Runs `/analyze-site` to populate `site.config.json`
2. Creates page object classes in `src/pages/` for every nav-linked page
3. Updates `src/fixtures/site.fixture.ts` to expose new page objects
4. Writes or updates spec files for all test categories:
   - `tests/smoke/` — site availability
   - `tests/navigation/` — nav links, mobile menu
   - `tests/forms/` — contact form fields
   - `tests/functional/` — business logic per page
   - `tests/visual/` — screenshot baselines
   - `tests/responsive/` — layout at all viewports
5. Runs `npx tsc --noEmit` and fixes any errors
6. Reports what was created and what manual review is needed

### Rules

- Uses real DOM-inspected selectors, not placeholders
- Never submits forms
- Tags every test correctly
- Follows strict TypeScript conventions

---

## `/run-smoke`

**File:** `.claude/commands/run-smoke.md`

Runs the `@smoke` test suite and displays a formatted pass/fail table.

### Usage

```
/run-smoke
```

### Output

```
Site: Desert Saber (https://desertsaber.com)
Run: 2026-06-17 09:00:00   Duration: 8.2s

+-------------------------------------------+--------+----------+
| Test                                      | Status | Duration |
+-------------------------------------------+--------+----------+
| site homepage loads successfully          | PASS   | 1.1s     |
| page loads within acceptable time         | PASS   | 2.8s     |
| no critical JavaScript errors on load     | PASS   | 1.9s     |
| site is served over HTTPS                 | PASS   | 0.2s     |
| page has a title and meta description     | WARN   | 0.6s     |
+-------------------------------------------+--------+----------+
Total: 5   Passed: 4   Failed: 0   Warnings: 1
```

Failures include an error message and a suggested fix.

---

## `/update-baseline`

**File:** `.claude/commands/update-baseline.md`

Captures new visual regression baseline screenshots. Run this after intentional design changes.

### Usage

```
/update-baseline
```

### What it does

1. Runs `npm run baseline` (`playwright test --grep @visual --update-snapshots`)
2. Lists all updated PNG files under `__snapshots__/`
3. Reminds you to review images before committing

### When to run

- After a deliberate site redesign
- After updating viewport sizes in `playwright.config.ts`
- When onboarding a new repo (first-time baseline capture)

### Important

Visual tests will **skip** (not fail) when no baseline exists — run this first.
Review every updated screenshot before `git add __snapshots__/`.

---

## `/generate-report`

**File:** `.claude/commands/generate-report.md`

Parses `test-results/results.json` and displays a structured test summary.

### Usage

```
/generate-report
```

### Output

```
Test Run Summary — Desert Saber (https://desertsaber.com)

+------------------+-------+--------+--------+-------+
| Suite            | Total | Passed | Failed | Flaky |
+------------------+-------+--------+--------+-------+
| @smoke           |     5 |      5 |      0 |     0 |
| @navigation      |     4 |      4 |      0 |     0 |
| @forms           |     5 |      4 |      0 |     1 |
| @visual          |     3 |      3 |      0 |     0 |
| @responsive      |     5 |      5 |      0 |     0 |
+------------------+-------+--------+--------+-------+
| TOTAL            |    22 |     21 |      0 |     1 |
+------------------+-------+--------+--------+-------+

Overall: 95.5% pass rate
```

Failed and flaky tests are listed with error messages and suggested next steps.

---

## Creating a New Skill

Skills are markdown files in `.claude/commands/`. Each file:

1. Has a `# /skill-name` H1 header matching the command name
2. Describes what the command does as a numbered list
3. Shows example output
4. Lists edge cases and handling

```markdown
# /my-new-command

What this command does:

1. Step one
2. Step two
3. Output format: ...
```

After creating the file, the skill appears automatically in Claude Code as `/my-new-command`.
See [Agent.md](Agent.md) for the full `.claude/` directory structure.
