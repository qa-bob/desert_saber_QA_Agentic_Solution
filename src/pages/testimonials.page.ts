/**
 * src/pages/testimonials.page.ts
 *
 * TestimonialsPage models the /testimonials page on desertsaber.com.
 * Provides methods for discovering testimonial cards, quote text,
 * and attribution (customer name/company).
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class TestimonialsPage extends BasePage {
  private static readonly PATH = '/testimonials';

  readonly pageHeading: Locator;
  readonly navElement: Locator;

  constructor(page: import('@playwright/test').Page, config: import('@site-types/site-config.types').SiteConfig) {
    super(page, config);
    this.pageHeading = page.locator('h1, h2').first();
    this.navElement  = page.locator('nav, [role="navigation"]').first();
  }

  // ── Navigation ────────────────────────────────────────────────────────────────

  async navigateToTestimonials(): Promise<void> {
    const url = this.url.replace(/\/$/, '') + TestimonialsPage.PATH;
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('load');
  }

  // ── Testimonial discovery ─────────────────────────────────────────────────────

  /**
   * Return locators for testimonial cards or quote blocks.
   * Tries multiple common patterns used by website builders.
   */
  private getTestimonialLocator(): Locator {
    return this.page.locator(
      '[class*="testimonial" i], [class*="quote" i], [class*="review" i], ' +
      'blockquote, [class*="card" i]:has(p)'
    );
  }

  /** Return the count of visible testimonial blocks. */
  async getTestimonialCount(): Promise<number> {
    return this.getTestimonialLocator().count();
  }

  /** Return all visible text content that looks like a testimonial quote. */
  async getTestimonialTexts(): Promise<string[]> {
    const blocks = this.getTestimonialLocator();
    const count = await blocks.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await blocks.nth(i).textContent();
      if (text?.trim()) texts.push(text.trim());
    }
    return texts;
  }

  /** Return true if the page has any visible blockquote or testimonial content. */
  async hasTestimonialContent(): Promise<boolean> {
    const count = await this.getTestimonialCount();
    if (count > 0) return true;

    // Fallback: check for quote-like paragraphs
    const paragraphs = this.page.locator('p').filter({ hasText: /"/i });
    return (await paragraphs.count()) > 0;
  }

  /** Return the main page heading text. */
  async getMainHeadingText(): Promise<string> {
    if (await this.pageHeading.count() === 0) return '';
    return (await this.pageHeading.textContent())?.trim() ?? '';
  }
}
