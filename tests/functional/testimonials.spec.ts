/**
 * tests/functional/testimonials.spec.ts
 *
 * Functional tests for the Desert Saber Testimonials page (/testimonials).
 * Covers: page load, testimonial content presence, heading structure,
 * and navigation consistency.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Testimonials Page @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(`${siteConfig.url.replace(/\/$/, '')}/testimonials`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForLoadState('networkidle');
  });

  // ── Page load ───────────────────────────────────────────────────────────────

  test('testimonials page loads successfully @functional', async ({ page, siteConfig }) => {
    const url = page.url();
    expect(url.toLowerCase()).toContain('testimonial');

    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.trim().length,
      'Testimonials page should have visible content'
    ).toBeGreaterThan(50);
  });

  test('testimonials page has a title @functional', async ({ page }) => {
    const title = await page.title();
    expect(title.trim().length, 'Page title should not be empty').toBeGreaterThan(0);
  });

  // ── Testimonial content ─────────────────────────────────────────────────────

  test('testimonials page has at least one heading @functional', async ({ page }) => {
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10_000 });
  });

  test('testimonials page contains customer or testimonial content @functional', async ({ page }) => {
    const testimonialContent = page.locator(
      '[class*="testimonial" i], [class*="quote" i], [class*="review" i], blockquote'
    );

    const testimonialText = page.getByText(
      /testimonial|customer|client|partner|feedback|said|quote/i
    );

    const hasBlocks = (await testimonialContent.count()) > 0;
    const hasText   = (await testimonialText.count()) > 0;

    expect(
      hasBlocks || hasText,
      'Testimonials page should contain testimonial blocks or testimonial-related text'
    ).toBeTruthy();
  });

  test('page text does not match an error page @functional', async ({ page }) => {
    const bodyText = (await page.evaluate<string>(() => document.body.innerText)).toLowerCase();
    const isErrorPage =
      bodyText.includes('404') ||
      bodyText.includes('page not found') ||
      bodyText.includes('error') && bodyText.length < 200;

    expect(isErrorPage, 'Testimonials page should not show a 404 or error message').toBeFalsy();
  });

  // ── Navigation ──────────────────────────────────────────────────────────────

  test('navigation is present on testimonials page @functional', async ({ page }) => {
    const nav = page.locator('nav, [role="navigation"]').first();
    await expect(nav).toBeVisible({ timeout: 10_000 });
  });

  test('footer is present on testimonials page @functional', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]').first();
    if (await footer.count() > 0) {
      await expect(footer).toBeVisible({ timeout: 10_000 });
    }
  });
});
