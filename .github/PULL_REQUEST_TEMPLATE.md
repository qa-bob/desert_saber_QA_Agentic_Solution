## Summary

<!-- What does this PR do? One or two sentences. -->

## Type of Change

- [ ] New test(s)
- [ ] Fix failing / flaky test
- [ ] Update visual baseline
- [ ] New page object class
- [ ] Framework / config change
- [ ] Documentation update

## Test Tags Affected

- [ ] `@smoke`
- [ ] `@navigation`
- [ ] `@forms`
- [ ] `@functional`
- [ ] `@visual`
- [ ] `@responsive`

## Checklist

- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run test:smoke` passes
- [ ] New/changed tests pass locally: `npx playwright test <path-to-spec>`
- [ ] Every new test is tagged with at least one tag
- [ ] No hardcoded URLs — all URLs use `siteConfig.url`
- [ ] No form submission code added
- [ ] No `expect()` calls inside page object methods
- [ ] If visual baselines updated: screenshots reviewed before committing

## Evidence

<!-- Paste the Playwright test output or a screenshot of the HTML report. -->

```
Passing tests output here...
```
