import { test as base } from '@playwright/test';
import { CrudPage } from '../pages/CrudPage';

/**
 * Custom test fixtures that provide page objects to tests
 */
type PageFixtures = {
  crudPage: CrudPage;
};

export const test = base.extend<PageFixtures>({
  crudPage: async ({ page }, use) => {
    const crudPage = new CrudPage(page);
    await use(crudPage);
  },
});

export { expect } from '@playwright/test';
