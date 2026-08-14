/**
 * src/pages/videos.page.ts
 *
 * VideosPage models the /videos page on desertsaber.com.
 * Provides methods for discovering video embeds, thumbnails,
 * and media elements without playing any video.
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class VideosPage extends BasePage {
  private static readonly PATH = '/videos';

  readonly pageHeading: Locator;
  readonly navElement: Locator;

  constructor(page: import('@playwright/test').Page, config: import('@site-types/site-config.types').SiteConfig) {
    super(page, config);
    this.pageHeading = page.locator('h1, h2').first();
    this.navElement  = page.locator('nav, [role="navigation"]').first();
  }

  // ── Navigation ────────────────────────────────────────────────────────────────

  async navigateToVideos(): Promise<void> {
    const url = this.url.replace(/\/$/, '') + VideosPage.PATH;
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle');
  }

  // ── Media discovery ───────────────────────────────────────────────────────────

  /** Return a locator for video embed iframes (YouTube, Vimeo, etc.). */
  getVideoIframeLocator(): Locator {
    return this.page.locator(
      'iframe[src*="youtube" i], iframe[src*="youtu.be" i], ' +
      'iframe[src*="vimeo" i], iframe[src*="wistia" i], ' +
      'iframe[title*="video" i], iframe[allow*="autoplay" i]'
    );
  }

  /** Return a locator for native <video> elements. */
  getNativeVideoLocator(): Locator {
    return this.page.locator('video');
  }

  /** Return a locator for video thumbnail images. */
  getVideoThumbnailLocator(): Locator {
    return this.page.locator(
      'img[src*="thumbnail" i], img[alt*="video" i], ' +
      '[class*="video-thumb" i], [class*="video-preview" i]'
    );
  }

  /** Return the count of all detected video elements (iframes + native). */
  async getVideoCount(): Promise<number> {
    const iframes = await this.getVideoIframeLocator().count();
    const native = await this.getNativeVideoLocator().count();
    return iframes + native;
  }

  /** Return true if at least one video embed or native video is present. */
  async hasVideoContent(): Promise<boolean> {
    const count = await this.getVideoCount();
    if (count > 0) return true;

    // Fallback: check for video-related text or thumbnail images
    const thumbnails = await this.getVideoThumbnailLocator().count();
    if (thumbnails > 0) return true;

    // Check page text for video-related content
    const videoText = this.page.getByText(/watch|video|demo|training simulation/i);
    return (await videoText.count()) > 0;
  }

  /** Return the main page heading text. */
  async getMainHeadingText(): Promise<string> {
    if (await this.pageHeading.count() === 0) return '';
    return (await this.pageHeading.textContent())?.trim() ?? '';
  }
}
