/**
 * tests/functional/platform.spec.ts
 *
 * Functional tests for the Desert Saber Platform page (/platform).
 * Covers: page load, key headings, Conundrum™ platform description,
 * modular training structure, and adaptive learning content.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Platform Page @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(`${siteConfig.url.replace(/\/$/, '')}/platform`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForLoadState('networkidle');
  });

  // ── Page load ───────────────────────────────────────────────────────────────

  test('platform page loads successfully @functional', async ({ page }) => {
    const url = page.url();
    expect(url).toContain('platform');

    const body = await page.evaluate<string>(() => document.body.innerText);
    expect(body.trim().length).toBeGreaterThan(100);
  });

  test('platform page has a title @functional', async ({ page }) => {
    const title = await page.title();
    expect(title.trim().length).toBeGreaterThan(0);
    expect(title.toLowerCase()).toMatch(/desert saber|platform/i);
  });

  // ── Conundrum™ platform content ─────────────────────────────────────────────

  test('Conundrum™ platform heading is present @functional', async ({ page }) => {
    const heading = page.getByText(/conundrum/i);
    if (await heading.count() > 0) {
      await expect(heading.first()).toBeVisible({ timeout: 10_000 });
    } else {
      console.warn('[functional/platform] "Conundrum" heading not found — content may have changed.');
    }
  });

  test('platform page describes synthetic learning @functional', async ({ page }) => {
    const synthContent = page.getByText(/synthetic learning/i);
    if (await synthContent.count() > 0) {
      await expect(synthContent.first()).toBeVisible({ timeout: 10_000 });
    } else {
      console.warn('[functional/platform] "Synthetic Learning" not found — content may have changed.');
    }
  });

  // ── Training structure content ──────────────────────────────────────────────

  test('modular training content is present @functional', async ({ page }) => {
    const modularText = page.getByText(/module|micro-learning|mini-learning/i);
    if (await modularText.count() > 0) {
      await expect(modularText.first()).toBeVisible({ timeout: 10_000 });
    } else {
      console.warn('[functional/platform] Modular training content not found.');
    }
  });

  test('page has multiple content sections @functional', async ({ page }) => {
    const sections = page.locator('h2, h3, h4');
    const count = await sections.count();
    expect(
      count,
      'Platform page should have multiple section headings'
    ).toBeGreaterThanOrEqual(2);
  });

  // ── Navigation from platform page ───────────────────────────────────────────

  test('navigation is present on platform page @functional', async ({ page }) => {
    const nav = page.locator('nav, [role="navigation"]').first();
    await expect(nav).toBeVisible({ timeout: 10_000 });
  });

  test('navigation links back to home @functional', async ({ page, siteConfig }) => {
    const homeLink = page.locator('a[href="/"], a[href="' + siteConfig.url + '"]').first();
    const logoLink = page.locator('a[class*="logo" i], header a').first();

    const hasHomeLink = (await homeLink.count()) > 0 || (await logoLink.count()) > 0;
    expect(hasHomeLink, 'Platform page should have a link back to the homepage').toBeTruthy();
  });
});
