/**
 * src/pages/content-section.page.ts
 *
 * ContentSectionPage is a generic page object for simple content pages
 * that don't have unique interactive elements requiring a dedicated class.
 *
 * Used for: /addl-features, /value, /differentiation, /about-us, /customers
 *
 * Extends BasePage with common content inspection methods.
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class ContentSectionPage extends BasePage {
  readonly pageHeading: Locator;
  readonly navElement: Locator;
  readonly footer: Locator;

  constructor(page: import('@playwright/test').Page, config: import('@site-types/site-config.types').SiteConfig) {
    super(page, config);
    this.pageHeading = page.locator('h1, h2').first();
    this.navElement  = page.locator('nav, [role="navigation"]').first();
    this.footer      = page.locator('footer, [role="contentinfo"]').first();
  }

  // ── Navigation ────────────────────────────────────────────────────────────────

  /** Navigate to a specific path under the site's base URL. */
  async navigateTo(path: string): Promise<void> {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = this.url.replace(/\/$/, '') + normalizedPath;
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  // ── Content inspection ────────────────────────────────────────────────────────

  /** Return true if the page body has meaningful visible text. */
  async hasBodyContent(minLength = 50): Promise<boolean> {
    const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
    return bodyText.trim().length > minLength;
  }

  /** Return the full body text of the current page. */
  async getBodyText(): Promise<string> {
    return this.page.evaluate<string>(() => document.body.innerText);
  }

  /** Return all visible section headings (h2, h3, h4) on the page. */
  async getSectionHeadings(): Promise<string[]> {
    const headings = this.page.locator('h2, h3, h4');
    const count = await headings.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await headings.nth(i).textContent();
      if (text?.trim()) texts.push(text.trim());
    }
    return texts;
  }

  /** Return true if the navigation element is visible. */
  async isNavPresent(): Promise<boolean> {
    return (await this.navElement.count()) > 0 && await this.navElement.isVisible();
  }

  /** Return the main page heading text. */
  async getMainHeadingText(): Promise<string> {
    if (await this.pageHeading.count() === 0) return '';
    return (await this.pageHeading.textContent())?.trim() ?? '';
  }

  /** Return the page <title>. */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  /** Return true if at least one image is visible on the page. */
  async hasImages(): Promise<boolean> {
    const images = this.page.locator('img:visible');
    return (await images.count()) > 0;
  }
}
