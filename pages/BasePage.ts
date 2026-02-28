import { Page } from '@playwright/test';

export class BasePage {
  // Common locators shared across all pages
  protected readonly appHeading = 'h1:has-text("CRUD App")';

  constructor(protected page: Page) {}
}
