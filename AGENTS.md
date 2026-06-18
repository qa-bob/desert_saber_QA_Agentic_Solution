# AGENTS.md — Desert Saber QA Agentic Solution

> Instructions for AI coding agents (GitHub Copilot, OpenAI Codex, and others).
> Claude Code reads `CLAUDE.md` instead — see that file for Claude-specific instructions.

---

## Repository Purpose

This is a **Playwright + TypeScript regression test suite** for [Desert Saber](https://desertsaber.com) — a virtual training and simulation platform. The framework uses a **Page Object Model (POM)** architecture with strict TypeScript.

---

## Key Conventions

### TypeScript

- Strict mode is enabled — no implicit `any`, no `any` without explicit justification
- Path aliases: `@pages/*`, `@fixtures/*`, `@utils/*`, `@site-types/*`
- All page object properties must be typed as `readonly Locator`
- Run `npx tsc --noEmit` before finishing any change

### Page Object Model

- Every page has a class in `src/pages/` that extends `BasePage`
- Locators are class properties; user actions are methods; assertions never go inside page objects
- Tests import page objects via the custom fixture: `import { test, expect } from '@fixtures/site.fixture'`

### Tests

- Tags are required: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- Never hardcode the base URL — use `siteConfig.url` from the fixture
- Never submit forms — test field interactions and validation only
- Never use `page.waitForTimeout()` — use Playwright's built-in auto-waiting

### Selectors

- Prefer role-based selectors: `page.getByRole('button', { name: /submit/i })`
- Use `data-testid` when available
- Avoid brittle CSS class selectors where possible

---

## Directory Layout

```
src/pages/         # Page Object Model classes (one per page)
src/fixtures/      # Custom Playwright test fixtures
src/utils/         # Shared helpers (link checker, visual helper)
src/types/         # TypeScript interfaces
tests/smoke/       # @smoke — availability checks
tests/navigation/  # @navigation — nav link checks
tests/forms/       # @forms — contact form validation
tests/functional/  # @functional — business logic
tests/visual/      # @visual — screenshot regression
tests/responsive/  # @responsive — layout checks
.claude/agents/    # Claude Code sub-agent definitions
.claude/commands/  # Claude Code slash commands
.claude/rules/     # Path-scoped instruction files
```

---

## Available npm Scripts

```bash
npm test                    # Run all tests
npm run test:smoke          # @smoke tests only
npm run test:navigation     # @navigation tests only
npm run test:forms          # @forms tests only
npm run test:visual         # @visual tests only
npm run test:responsive     # @responsive tests only
npm run baseline            # Update visual snapshots
npm run lint                # ESLint
npm run typecheck           # TypeScript check
```

---

## What NOT to Do

- Do not submit forms (the company receives real emails)
- Do not create accounts or enter real credentials
- Do not hardcode `https://desertsaber.com` in tests — use `baseURL` from config
- Do not add `expect()` inside page object methods
- Do not use `page.waitForTimeout()` for anything > 500ms
- Do not merge failing typecheck results
