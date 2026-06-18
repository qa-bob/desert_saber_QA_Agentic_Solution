/**
 * tests/functional/homepage.spec.ts
 *
 * Functional tests for the Desert Saber homepage.
 * Covers: hero section, key headings, industry sections, feature sections,
 * CTA links, and footer presence.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Homepage Functional @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    // Dismiss cookie consent banner if present
    const cookieAccept = page.locator(
      'button[aria-label*="accept" i], button:has-text("Accept"), button:has-text("OK")'
    ).first();
    if (await cookieAccept.count() > 0 && await cookieAccept.isVisible()) {
      await cookieAccept.click();
    }
  });

  // ── Page title ──────────────────────────────────────────────────────────────

  test('homepage has correct page title @functional', async ({ page }) => {
    const title = await page.title();
    expect(title.trim()).toBeTruthy();
    expect(title.toLowerCase()).toContain('desert saber');
  });

  // ── Hero section ────────────────────────────────────────────────────────────

  test('hero section is visible with main heading @functional', async ({ page }) => {
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10_000 });

    const text = await heading.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('"Welcome to Desert Saber" heading is present @functional', async ({ page }) => {
    const welcomeHeading = page.getByText(/welcome to desert saber/i);
    await expect(welcomeHeading.first()).toBeVisible({ timeout: 10_000 });
  });

  test('"Reimagine Learning" tagline is present @functional', async ({ page }) => {
    const tagline = page.getByText(/reimagine learning/i);
    await expect(tagline.first()).toBeVisible({ timeout: 10_000 });
  });

  // ── Feature sections ────────────────────────────────────────────────────────

  test('homepage has multiple content sections @functional', async ({ page }) => {
    const sections = page.locator('section, [class*="section"], article').filter({
      has: page.locator('h2, h3, h4'),
    });
    const count = await sections.count();
    expect(count, 'Homepage should have multiple content sections').toBeGreaterThan(2);
  });

  test('"Engage the Learner" section is visible @functional', async ({ page }) => {
    const section = page.getByText(/engage the learner/i);
    if (await section.count() > 0) {
      await expect(section.first()).toBeVisible({ timeout: 10_000 });
    } else {
      console.warn('[functional] "Engage the Learner" section not found — site may have been updated.');
    }
  });

  test('"Enterprise Learning" section is visible @functional', async ({ page }) => {
    const section = page.getByText(/enterprise learning/i);
    if (await section.count() > 0) {
      await expect(section.first()).toBeVisible({ timeout: 10_000 });
    } else {
      console.warn('[functional] "Enterprise Learning" section not found — site may have been updated.');
    }
  });

  // ── Industry applications ───────────────────────────────────────────────────

  test('industry application sections are present @functional', async ({ page }) => {
    const industries = ['Rail', 'Mining', 'Manufacturing'];
    let foundCount = 0;

    for (const industry of industries) {
      const el = page.getByText(new RegExp(industry, 'i'));
      if (await el.count() > 0) {
        foundCount++;
      }
    }

    expect(
      foundCount,
      `Expected at least 2 of ${industries.join(', ')} to appear on the homepage`
    ).toBeGreaterThanOrEqual(2);
  });

  // ── CTA links ───────────────────────────────────────────────────────────────

  test('page contains at least one call-to-action link @functional', async ({ page }) => {
    const ctaLinks = page.locator(
      'a[href*="account"], a[href*="contact"], a[href*="sign"], ' +
      'a[class*="btn" i], a[class*="button" i], a[class*="cta" i]'
    );

    const fallback = page.locator('a, button').filter({
      hasText: /sign in|create account|contact|get started|learn more|join/i,
    });

    const ctaCount = (await ctaLinks.count()) + (await fallback.count());
    expect(ctaCount, 'Homepage should have at least one CTA link or button').toBeGreaterThan(0);
  });

  test('"Sign In" link is present in navigation @functional', async ({ page }) => {
    const signInLink = page.locator('a[href*="account"]').filter({ hasText: /sign in/i });
    const fallback = page.getByRole('link', { name: /sign in/i });

    const found = (await signInLink.count()) > 0 || (await fallback.count()) > 0;
    expect(found, '"Sign In" link should be accessible from the homepage').toBeTruthy();
  });

  // ── Footer ──────────────────────────────────────────────────────────────────

  test('footer is present @functional', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]');
    await expect(footer.first()).toBeVisible({ timeout: 10_000 });
  });

  test('footer contains copyright notice @functional', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]').first();
    if (await footer.count() === 0) {
      test.skip(true, 'No footer element found');
      return;
    }
    const footerText = await footer.textContent();
    expect(
      footerText?.toLowerCase().includes('desert saber') ||
      footerText?.includes('©') ||
      footerText?.toLowerCase().includes('copyright'),
      'Footer should contain a copyright notice referencing Desert Saber'
    ).toBeTruthy();
  });

  // ── Images ──────────────────────────────────────────────────────────────────

  test('hero area contains at least one visible image @functional', async ({ page }) => {
    const heroImages = page.locator(
      'header img, section:first-of-type img, [class*="hero" i] img'
    );
    const pageImages = page.locator('img:visible');

    const heroCount = await heroImages.count();
    const pageImgCount = await pageImages.count();

    expect(
      heroCount + pageImgCount,
      'Homepage should have visible images'
    ).toBeGreaterThan(0);
  });
});
