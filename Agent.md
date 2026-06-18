# Agent.md — AI Agents in This Repository

This document describes the AI agents available in this Claude Code project, when to use them, and how they interact with the test framework.

---

## Overview

This repository uses two types of agent-based automation:

| Type | Location | Purpose |
|---|---|---|
| **Sub-agents** | `.claude/agents/*.md` | Autonomous Claude Code agents invoked for specific tasks |
| **Slash commands** | `.claude/commands/*.md` | Scripted workflows invoked with `/command-name` |

Sub-agents perform multi-step autonomous tasks. Slash commands are structured prompts that guide Claude through a repeatable procedure.

---

## Sub-Agents

### `site-analyzer`

**File:** `.claude/agents/site-analyzer.md`

**Role:** Crawls a live website and produces a fully-populated `site.config.json`.

**When to invoke:**
- Onboarding a new company repo (first-time config generation)
- Verifying `site.config.json` is still accurate after a site redesign
- Running the `/analyze-site` slash command

**What it does:**
1. Resolves the canonical URL via HEAD request + redirect following
2. Navigates with `waitUntil: 'networkidle'` and handles SPA hydration
3. Dismisses cookie consent banners
4. Extracts nav link text and hrefs
5. Finds contact forms (checking homepage, `/contact`, `/contact-us`, `/get-in-touch`)
6. Infers industry from page copy
7. Sets `skipVisual` if the site has heavy animations
8. Sets `auth.required` if any page redirected to a login URL
9. Outputs a valid `site.config.json` block with a confidence assessment

**Output:** Updated `site.config.json` + issues checklist + confidence rating

---

### `test-generator`

**File:** `.claude/agents/test-generator.md`

**Role:** Reads `site.config.json` and generates site-specific Playwright test files for functionality not covered by the shared suite.

**When to invoke:**
- A site has unique pages or interactive elements needing dedicated tests
- A client requests additional coverage (pricing page, demo flow, blog pagination)
- Generic selectors fail and site-specific locators are needed
- Writing regression tests for a recently discovered bug

**What it does:**
1. Reads `site.config.json` for site structure
2. Identifies gaps in the shared test suites
3. Plans test scenarios before writing code
4. Generates page object additions if needed
5. Writes spec files to `tests/custom/<kebab-case>.spec.ts`

**Output:** TypeScript spec files in `tests/custom/` with `@custom` tag

---

## Slash Commands

See [Skills.md](Skills.md) for full usage documentation. Summary:

| Command | What It Does |
|---|---|
| `/analyze-site [url]` | Runs the `site-analyzer` agent |
| `/generate-full-suite` | Full POM + test generation pass |
| `/run-smoke` | Runs smoke tests and shows pass/fail summary |
| `/update-baseline` | Captures new visual regression baselines |
| `/generate-report` | Parses results and shows a structured summary |

---

## Agent Design Principles

All agents in this repo follow these rules:

1. **Read `site.config.json` first** — agents derive behavior from config, not hardcoded values
2. **Use live selectors** — agents fetch the real site with `WebFetch` before writing any locators
3. **Never submit forms** — agents interact with forms but never trigger submissions
4. **Follow the POM** — generated tests use page objects, not raw `page.locator()` in spec bodies
5. **TypeScript strict** — all generated code compiles with zero `tsc --noEmit` errors

---

## Adding a New Agent

1. Create `.claude/agents/<agent-name>.md`
2. Define: Role, When to invoke, Capabilities, Inputs, Outputs, Step-by-step instructions, Edge cases
3. If it has a user-facing slash command, also create `.claude/commands/<command-name>.md`
4. Document it in this file and in [Skills.md](Skills.md)

---

## Claude Code Configuration

Claude Code itself reads `CLAUDE.md` for project instructions. The `.claude/` folder structure is:

```
.claude/
├── agents/
│   ├── site-analyzer.md      # Site analysis sub-agent
│   └── test-generator.md     # Test generation sub-agent
├── commands/
│   ├── analyze-site.md       # /analyze-site
│   ├── generate-full-suite.md # /generate-full-suite
│   ├── run-smoke.md          # /run-smoke
│   ├── update-baseline.md    # /update-baseline
│   └── generate-report.md   # /generate-report
└── rules/
    ├── testing.md             # Test writing rules (scoped to tests/**)
    └── playwright.md          # Playwright best practices
```
