/**
 * src/fixtures/site.fixture.ts
 *
 * Extends Playwright's base `test` with pre-constructed page objects and the
 * loaded site config.  All test files should import {test, expect} from here
 * instead of from '@playwright/test' directly.
 *
 * Usage in test files:
 *   import { test, expect } from '@fixtures/site.fixture';
 */

import { test as base, expect } from '@playwright/test';
import { loadSiteConfig, type SiteConfig } from '@site-types/site-config.types';
import { HomePage } from '@pages/home.page';
import { NavigationPage } from '@pages/navigation.page';
import { ContactFormPage } from '@pages/contact.page';
import { PlatformPage } from '@pages/platform.page';
import { TestimonialsPage } from '@pages/testimonials.page';
import { VideosPage } from '@pages/videos.page';
import { ContentSectionPage } from '@pages/content-section.page';

// ── Fixture type definitions ─────────────────────────────────────────────────

export interface Fixtures {
  /** Fully resolved site configuration loaded from site.config.json */
  siteConfig: SiteConfig;
  /** Pre-navigated HomePage page object */
  homePage: HomePage;
  /** NavigationPage page object (does not auto-navigate) */
  navigationPage: NavigationPage;
  /** ContactFormPage page object (does not auto-navigate) */
  contactPage: ContactFormPage;
  /** PlatformPage page object (does not auto-navigate) */
  platformPage: PlatformPage;
  /** TestimonialsPage page object (does not auto-navigate) */
  testimonialsPage: TestimonialsPage;
  /** VideosPage page object (does not auto-navigate) */
  videosPage: VideosPage;
  /** Generic ContentSectionPage for simple content pages */
  contentPage: ContentSectionPage;
}

// ── Extended test object ─────────────────────────────────────────────────────

export const test = base.extend<Fixtures>({
  /**
   * siteConfig — loaded once per worker from site.config.json.
   * Shared across all fixtures in the same test.
   */
  siteConfig: async ({}, use) => {
    const config = loadSiteConfig();
    await use(config);
  },

  /**
   * homePage — constructs HomePage and navigates to the site root.
   * Waits for domcontentloaded before handing control to the test.
   */
  homePage: async ({ page, siteConfig }, use) => {
    const homePage = new HomePage(page, siteConfig);
    await homePage.navigate();
    await use(homePage);
  },

  /**
   * navigationPage — constructs NavigationPage without navigating.
   * Tests that need to be on a specific page should call navigate() themselves.
   */
  navigationPage: async ({ page, siteConfig }, use) => {
    const navigationPage = new NavigationPage(page, siteConfig);
    await use(navigationPage);
  },

  /**
   * contactPage — constructs ContactFormPage without navigating.
   * Tests should navigate to the appropriate page first.
   */
  contactPage: async ({ page, siteConfig }, use) => {
    const contactPage = new ContactFormPage(page, siteConfig);
    await use(contactPage);
  },

  /**
   * platformPage — constructs PlatformPage without navigating.
   * Call navigateToPlatform() in beforeEach.
   */
  platformPage: async ({ page, siteConfig }, use) => {
    const platformPage = new PlatformPage(page, siteConfig);
    await use(platformPage);
  },

  /**
   * testimonialsPage — constructs TestimonialsPage without navigating.
   * Call navigateToTestimonials() in beforeEach.
   */
  testimonialsPage: async ({ page, siteConfig }, use) => {
    const testimonialsPage = new TestimonialsPage(page, siteConfig);
    await use(testimonialsPage);
  },

  /**
   * videosPage — constructs VideosPage without navigating.
   * Call navigateToVideos() in beforeEach.
   */
  videosPage: async ({ page, siteConfig }, use) => {
    const videosPage = new VideosPage(page, siteConfig);
    await use(videosPage);
  },

  /**
   * contentPage — generic ContentSectionPage for simple content pages.
   * Call navigateTo('/path') in beforeEach.
   */
  contentPage: async ({ page, siteConfig }, use) => {
    const contentPage = new ContentSectionPage(page, siteConfig);
    await use(contentPage);
  },
});

// Re-export expect so tests only need one import source
export { expect };
