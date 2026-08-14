/**
 * tests/functional/videos.spec.ts
 *
 * Functional tests for the Desert Saber Videos page (/videos).
 * Covers: page load, video element presence (iframes, native video, thumbnails),
 * heading structure, and navigation.
 *
 * Tests verify video elements are PRESENT — they do not play any video.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Videos Page @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(`${siteConfig.url.replace(/\/$/, '')}/videos`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForLoadState('networkidle');
  });

  // ── Page load ───────────────────────────────────────────────────────────────

  test('videos page loads successfully @functional', async ({ page }) => {
    const url = page.url();
    expect(url.toLowerCase()).toContain('video');

    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.trim().length,
      'Videos page should have visible content'
    ).toBeGreaterThan(50);
  });

  test('videos page has a title @functional', async ({ page }) => {
    const title = await page.title();
    expect(title.trim().length, 'Page title should not be empty').toBeGreaterThan(0);
  });

  // ── Video content ───────────────────────────────────────────────────────────

  test('videos page has at least one heading @functional', async ({ page }) => {
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10_000 });
  });

  test('videos page contains video or media content @functional', async ({ page }) => {
    // Check for embedded video iframes (YouTube, Vimeo, Wistia, etc.)
    const videoIframes = page.locator(
      'iframe[src*="youtube" i], iframe[src*="youtu.be" i], ' +
      'iframe[src*="vimeo" i], iframe[src*="wistia" i], ' +
      'iframe[allow*="autoplay" i]'
    );

    // Check for native HTML5 video elements
    const nativeVideo = page.locator('video');

    // Check for video thumbnail images
    const thumbnails = page.locator(
      'img[src*="thumbnail" i], img[alt*="video" i], ' +
      '[class*="video-thumb" i], [class*="video-cover" i]'
    );

    // Check for video-related text content
    const videoText = page.getByText(/watch|video|demo|training simulation|play/i);

    const hasIframe    = (await videoIframes.count()) > 0;
    const hasNative    = (await nativeVideo.count()) > 0;
    const hasThumbnail = (await thumbnails.count()) > 0;
    const hasText      = (await videoText.count()) > 0;

    expect(
      hasIframe || hasNative || hasThumbnail || hasText,
      'Videos page should contain video embeds, native video elements, thumbnails, or video-related content'
    ).toBeTruthy();
  });

  test('page text does not match an error page @functional', async ({ page }) => {
    const bodyText = (await page.evaluate<string>(() => document.body.innerText)).toLowerCase();
    const isErrorPage =
      bodyText.includes('404') ||
      bodyText.includes('page not found') ||
      (bodyText.includes('error') && bodyText.length < 200);

    expect(isErrorPage, 'Videos page should not show a 404 or error message').toBeFalsy();
  });

  // ── Navigation ──────────────────────────────────────────────────────────────

  test('navigation is present on videos page @functional', async ({ page }) => {
    const nav = page.locator('nav, [role="navigation"]').first();
    await expect(nav).toBeVisible({ timeout: 10_000 });
  });
});
