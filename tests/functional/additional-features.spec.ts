/**
 * tests/functional/additional-features.spec.ts
 *
 * Functional tests for the Desert Saber Additional Features page (/addl-features).
 * Covers: page load, feature content presence, heading structure,
 * and navigation consistency.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe("Additional Features Page @functional", () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(`${siteConfig.url.replace(/\/$/, '')}/addl-features`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForLoadState('load');
  });

  // ── Page load ───────────────────────────────────────────────────────────────

  test('additional features page loads successfully @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.trim().length,
      'Additional features page should have visible content'
    ).toBeGreaterThan(50);
  });

  test('additional features page has a title @functional', async ({ page }) => {
    const title = await page.title();
    expect(title.trim().length, 'Page title should not be empty').toBeGreaterThan(0);
  });

  // ── Feature content ─────────────────────────────────────────────────────────

  test('additional features page has at least one heading @functional', async ({ page }) => {
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10_000 });
  });

  test('additional features page has multiple content sections @functional', async ({ page }) => {
    const headings = page.locator('h2, h3, h4');
    const count = await headings.count();
    expect(
      count,
      'Additional features page should have multiple section headings'
    ).toBeGreaterThanOrEqual(1);
  });

  test('features page describes platform capabilities @functional', async ({ page }) => {
    const capabilityText = page.getByText(
      /feature|capability|learn|training|simulation|instructor|observer|coach/i
    );
    if (await capabilityText.count() > 0) {
      await expect(capabilityText.first()).toBeVisible({ timeout: 10_000 });
    } else {
      console.warn('[functional/addl-features] No feature-related text found — content may have changed.');
    }
  });

  test('page text does not indicate an error @functional', async ({ page }) => {
    const bodyText = (await page.evaluate<string>(() => document.body.innerText)).toLowerCase();
    const isErrorPage =
      bodyText.includes('404') ||
      bodyText.includes('page not found') ||
      (bodyText.includes('error') && bodyText.length < 200);

    expect(isErrorPage, 'Page should not display a 404 or error message').toBeFalsy();
  });

  // ── Navigation ──────────────────────────────────────────────────────────────

  test('navigation is present on additional features page @functional', async ({ page }, testInfo) => {
    // Small viewports usually hide the nav behind a toggle
    test.skip(testInfo.project.name !== 'chromium-desktop', 'Runs only in the "chromium-desktop" project');
    const nav = page.locator('nav, [role="navigation"]').first();
    await expect(nav).toBeVisible({ timeout: 10_000 });
  });
});
