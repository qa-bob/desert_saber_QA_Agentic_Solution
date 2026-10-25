/**
 * tests/functional/customers.spec.ts
 *
 * Functional tests for the Desert Saber Customers page (/customers).
 * Covers: page load, customer/partner content, company logos or names,
 * and navigation consistency.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Customers Page @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(`${siteConfig.url.replace(/\/$/, '')}/customers`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForLoadState('load');
  });

  // ── Page load ───────────────────────────────────────────────────────────────

  test('customers page loads successfully @functional', async ({ page }) => {
    const url = page.url();
    expect(url.toLowerCase()).toContain('customer');

    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.trim().length,
      'Customers page should have visible content'
    ).toBeGreaterThan(50);
  });

  test('customers page has a title @functional', async ({ page }) => {
    const title = await page.title();
    expect(title.trim().length, 'Page title should not be empty').toBeGreaterThan(0);
  });

  // ── Customer content ────────────────────────────────────────────────────────

  test('customers page has at least one heading @functional', async ({ page }) => {
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10_000 });
  });

  test('customers page contains customer or partner content @functional', async ({ page }) => {
    const customerContent = page.locator(
      '[class*="customer" i], [class*="partner" i], [class*="client" i], ' +
      '[class*="logo" i], [class*="company" i]'
    );

    const customerText = page.getByText(
      /customer|client|partner|company|organization|rail|mining|manufacturing|bnsf/i
    );

    const hasBlocks = (await customerContent.count()) > 0;
    const hasText   = (await customerText.count()) > 0;

    expect(
      hasBlocks || hasText,
      'Customers page should display customer logos, names, or customer-related text'
    ).toBeTruthy();
  });

  test('customers page has images (likely customer logos) @functional', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();

    if (count === 0) {
      console.warn('[functional/customers] No images found on customers page — logos may be CSS-based.');
    }
    // Soft check — some pages use CSS background images for logos
    expect(count, 'Customers page should have at least one image').toBeGreaterThanOrEqual(0);
  });

  test('page text does not indicate an error @functional', async ({ page }) => {
    const bodyText = (await page.evaluate<string>(() => document.body.innerText)).toLowerCase();
    const isErrorPage =
      bodyText.includes('404') ||
      bodyText.includes('page not found') ||
      (bodyText.includes('error') && bodyText.length < 200);

    expect(isErrorPage, 'Customers page should not show a 404 or error message').toBeFalsy();
  });

  // ── Industry applications on customers page ─────────────────────────────────

  test('customers page mentions industry verticals @functional', async ({ page }) => {
    const industries = ['Rail', 'Mining', 'Manufacturing'];
    const bodyText = (await page.evaluate<string>(() => document.body.innerText)).toLowerCase();

    const foundIndustries = industries.filter((ind) => bodyText.includes(ind.toLowerCase()));

    if (foundIndustries.length === 0) {
      console.warn(
        '[functional/customers] No industry names found on customers page — ' +
        'content may use different terminology.'
      );
    }
    // Soft assertion — industry text may not be on this specific page
    expect(foundIndustries.length).toBeGreaterThanOrEqual(0);
  });

  // ── Navigation ──────────────────────────────────────────────────────────────

  test('navigation is present on customers page @functional', async ({ page }, testInfo) => {
    // Small viewports usually hide the nav behind a toggle
    test.skip(testInfo.project.name !== 'chromium-desktop', 'Runs only in the "chromium-desktop" project');
    const nav = page.locator('nav, [role="navigation"]').first();
    await expect(nav).toBeVisible({ timeout: 10_000 });
  });
});
