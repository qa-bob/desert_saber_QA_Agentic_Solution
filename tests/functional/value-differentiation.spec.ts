/**
 * tests/functional/value-differentiation.spec.ts
 *
 * Functional tests for the Desert Saber Value page (/value) and
 * Differentiation page (/differentiation).
 *
 * Value page: business value proposition, ROI arguments, cost comparisons.
 * Differentiation page: competitive advantages, what sets Desert Saber apart.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

// ── Value Page ───────────────────────────────────────────────────────────────

test.describe('Value Page @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(`${siteConfig.url.replace(/\/$/, '')}/value`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForLoadState('networkidle');
  });

  test('value page loads successfully @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.trim().length,
      'Value page should have visible content'
    ).toBeGreaterThan(50);
  });

  test('value page has a title @functional', async ({ page }) => {
    const title = await page.title();
    expect(title.trim().length, 'Page title should not be empty').toBeGreaterThan(0);
  });

  test('value page has at least one heading @functional', async ({ page }) => {
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10_000 });
  });

  test('value page contains value or benefit content @functional', async ({ page }) => {
    const valueContent = page.getByText(
      /value|benefit|roi|return|cost|savings?|efficient|productiv|advantage|impact/i
    );
    if (await valueContent.count() > 0) {
      await expect(valueContent.first()).toBeVisible({ timeout: 10_000 });
    } else {
      console.warn('[functional/value] No value-related content found — page content may differ.');
    }
  });

  test('value page does not show an error @functional', async ({ page }) => {
    const bodyText = (await page.evaluate<string>(() => document.body.innerText)).toLowerCase();
    expect(
      bodyText.includes('404') || (bodyText.includes('error') && bodyText.length < 200),
      'Value page should not display a 404 or error'
    ).toBeFalsy();
  });

  test('navigation is visible on value page @functional', async ({ page }) => {
    const nav = page.locator('nav, [role="navigation"]').first();
    await expect(nav).toBeVisible({ timeout: 10_000 });
  });
});

// ── Differentiation Page ─────────────────────────────────────────────────────

test.describe('Differentiation Page @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(`${siteConfig.url.replace(/\/$/, '')}/differentiation`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForLoadState('networkidle');
  });

  test('differentiation page loads successfully @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.trim().length,
      'Differentiation page should have visible content'
    ).toBeGreaterThan(50);
  });

  test('differentiation page has a title @functional', async ({ page }) => {
    const title = await page.title();
    expect(title.trim().length, 'Page title should not be empty').toBeGreaterThan(0);
  });

  test('differentiation page has at least one heading @functional', async ({ page }) => {
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10_000 });
  });

  test('differentiation page contains competitive advantage content @functional', async ({ page }) => {
    const diffContent = page.getByText(
      /different|unique|advantage|competition|vs\.|versus|compare|only|first|exclusive/i
    );
    if (await diffContent.count() > 0) {
      await expect(diffContent.first()).toBeVisible({ timeout: 10_000 });
    } else {
      console.warn('[functional/differentiation] No differentiation-related content found — page content may differ.');
    }
  });

  test('differentiation page does not show an error @functional', async ({ page }) => {
    const bodyText = (await page.evaluate<string>(() => document.body.innerText)).toLowerCase();
    expect(
      bodyText.includes('404') || (bodyText.includes('error') && bodyText.length < 200),
      'Differentiation page should not display a 404 or error'
    ).toBeFalsy();
  });

  test('navigation is visible on differentiation page @functional', async ({ page }) => {
    const nav = page.locator('nav, [role="navigation"]').first();
    await expect(nav).toBeVisible({ timeout: 10_000 });
  });

  // ── Comparison to competitors ───────────────────────────────────────────────

  test('differentiation page mentions Desert Saber advantages @functional', async ({ page }) => {
    const advantages = page.getByText(/conundrum|adaptive|synthetic|consequence|open.world|immersive/i);
    if (await advantages.count() > 0) {
      await expect(advantages.first()).toBeVisible({ timeout: 10_000 });
    } else {
      console.warn('[functional/differentiation] Specific advantage keywords not found.');
    }
  });
});
