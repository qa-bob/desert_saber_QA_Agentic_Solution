---
name: New Test Coverage Request
about: Request tests for a page, feature, or scenario not currently covered
labels: enhancement, new-test
assignees: ''
---

## What Needs Testing?

<!-- Describe the page, feature, or user scenario that needs test coverage. -->

## Why Is This Not Already Covered?

- [ ] New page added to the site
- [ ] New feature or section discovered
- [ ] Existing test does not cover this specific scenario
- [ ] Bug regression — this scenario caused a real issue

## Page or URL

<!-- e.g., https://desertsaber.com/platform or https://desertsaber.com/testimonials -->

## Suggested Test Category

- [ ] `@smoke`
- [ ] `@navigation`
- [ ] `@forms`
- [ ] `@functional`
- [ ] `@visual`
- [ ] `@responsive`

## Specific Scenarios to Cover

<!-- List what should be asserted. Be specific. -->

1. [ ]
2. [ ]
3. [ ]

## Acceptance Criteria

<!-- How will we know these tests are good enough? -->

- [ ] Tests pass consistently across all three Playwright projects (desktop, mobile, tablet)
- [ ] TypeScript compiles cleanly after changes
- [ ] New page object class created if needed
- [ ] Tests follow tagging and POM conventions (see CONTRIBUTING.md)
