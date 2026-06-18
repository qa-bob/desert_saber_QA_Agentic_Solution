# GitHub Copilot Custom Instructions

## Context

This repository is a Playwright + TypeScript QA automation framework for https://desertsaber.com.
It follows a strict Page Object Model (POM) design pattern with TypeScript strict mode enabled.

## Code Style

- Use TypeScript strict mode — no implicit `any`
- Prefer `readonly` for Playwright `Locator` properties in page classes
- Use `async/await` throughout — never `.then()` chains in tests
- Prefer role-based selectors: `getByRole`, `getByLabel`, `getByText`
- Use descriptive test names that explain what is being verified

## Architecture

- Page objects live in `src/pages/`, extend `BasePage`, one class per page
- Tests import from `@fixtures/site.fixture` — never from `@playwright/test` directly
- Assertions (`expect`) belong in test files, not in page object methods
- The base URL comes from `siteConfig.url` via the fixture, never hardcoded

## Constraints

- Never generate code that submits a form
- Never generate code that creates an account or logs in
- Never use `page.waitForTimeout()` for waits over 500ms
- Always tag tests with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
