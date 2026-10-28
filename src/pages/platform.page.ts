/**
 * src/pages/platform.page.ts
 *
 * PlatformPage models the /platform page on desertsaber.com.
 * Covers the Conundrum™ platform description, adaptive learning content,
 * and modular training structure.
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class PlatformPage extends BasePage {
  // ── Page path ────────────────────────────────────────────────────────────────
  private static readonly PATH = '/platform';

  // ── Key locators ─────────────────────────────────────────────────────────────
  readonly pageHeading: Locator;
  readonly conundrumHeading: Locator;
  readonly navElement: Locator;

  constructor(page: import('@playwright/test').Page, config: import('@site-types/site-config.types').SiteConfig) {
    super(page, config);
    this.pageHeading    = page.locator('h1, h2').first();
    this.conundrumHeading = page.getByText(/conundrum/i).first();
    this.navElement     = page.locator('nav, [role="navigation"]').first();
  }

  // ── Navigation ────────────────────────────────────────────────────────────────

  async navigateToPlatform(): Promise<void> {
    const url = this.url.replace(/\/$/, '') + PlatformPage.PATH;
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('load');
  }

  // ── Content discovery ─────────────────────────────────────────────────────────

  /** Return all section headings (h2, h3, h4) found on the platform page. */
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

  /** Return true if the Conundrum™ platform branding is visible. */
  async hasConundrumContent(): Promise<boolean> {
    return (await this.conundrumHeading.count()) > 0;
  }

  /** Return true if the navigation is visible on this page. */
  async isNavPresent(): Promise<boolean> {
    return (await this.navElement.count()) > 0 && await this.navElement.isVisible();
  }

  /** Return the main page heading text. */
  async getMainHeadingText(): Promise<string> {
    if (await this.pageHeading.count() === 0) return '';
    return (await this.pageHeading.textContent())?.trim() ?? '';
  }
}
