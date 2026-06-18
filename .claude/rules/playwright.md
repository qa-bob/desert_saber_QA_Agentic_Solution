---
paths:
  - "src/**/*.ts"
  - "tests/**/*.ts"
---

# Playwright Best Practices

## Locator strategy (priority order)

1. `page.getByRole('button', { name: /submit/i })` — semantic, accessible
2. `page.getByLabel('Email address')` — for form inputs
3. `page.getByTestId('hero-cta')` — `data-testid` attributes
4. `page.getByText(/specific visible text/i)` — for unique text
5. `page.locator('nav a[href]')` — structural CSS when role selectors don't apply
6. Avoid: `.locator('.some-random-class')` — brittle, breaks on redesign

## Navigation

```typescript
// Preferred
await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

// For SPAs or pages with heavy async rendering
await page.goto(url, { waitUntil: 'networkidle' });

// After clicking a link
await page.waitForLoadState('domcontentloaded');
```

## Assertions (auto-wait built in)

```typescript
// Good — uses Playwright's auto-waiting
await expect(locator).toBeVisible({ timeout: 10_000 });
await expect(locator).toHaveText(/expected text/i);

// Avoid — manual count() without waiting
const count = await locator.count();
expect(count).toBeGreaterThan(0);
```

## Timeouts

| Scenario | Recommended value |
|---|---|
| Default element wait | 10_000ms (set in playwright.config.ts) |
| Navigation timeout | 30_000ms (set in playwright.config.ts) |
| Action timeout | 15_000ms (set in playwright.config.ts) |
| `waitForTimeout` max | 500ms (only for animation settle) |

## Multiple elements

```typescript
// Get all, iterate
const links = navLocator.locator('a[href]');
const count = await links.count();
for (let i = 0; i < count; i++) {
  const href = await links.nth(i).getAttribute('href');
  ...
}

// Filter to visible
const visible = page.locator('button').filter({ hasText: /submit/i });
```

## Viewport sizes

```typescript
// From playwright.config.ts projects — prefer these
// Desktop: 1280x720
// Mobile:  390x844  (Pixel 5)
// Tablet:  768x1024 (iPad Mini)

// Override in a test
await page.setViewportSize({ width: 390, height: 844 });
```

## Visual tests

```typescript
// Disable animations before screenshots
await page.emulateMedia({ reducedMotion: 'reduce' });

// Or set via screenshot options
await expect(page).toHaveScreenshot('name.png', {
  animations: 'disabled',
  fullPage: true,
  maxDiffPixels: 500,
});
```
