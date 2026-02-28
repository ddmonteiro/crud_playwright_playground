import { test, expect } from '../fixtures/pageFixtures';
import { DataFactory } from '../utils/DataFactory';

test.describe('Delete User', () => {
  
  test.beforeEach(async ({ crudPage }) => {
    await crudPage.navigate();
    await crudPage.verifyPageLoaded();
  });

  test('should delete a newly created user', async ({ crudPage }) => {
    // Get initial count of users in the table
    const initialCount = await crudPage.getRecordCount();

    // Create a new user
    const newUser = DataFactory.generateUserData();
    await crudPage.createRecord(newUser);

    // Verify user was added
    const countAfterAdd = await crudPage.getRecordCount();
    expect(countAfterAdd).toBe(initialCount + 1);

    // Verify the new user is visible
    const userRow = crudPage.getRowByText(newUser.name);
    await expect(userRow).toBeVisible();

    // Delete the newly created user
    await crudPage.clickDeleteButtonForUser(newUser.name);

    // Verify user was deleted
    const countAfterDelete = await crudPage.getRecordCount();
    expect(countAfterDelete).toBe(initialCount);

    // Verify the user is no longer visible
    await expect(userRow).not.toBeVisible();
  });

  test('should delete all existent records and show no users message', async ({ crudPage, page }) => {
    // Get initial record count
    let recordCount = await crudPage.getRecordCount();
    expect(recordCount).toBeGreaterThan(0);

    // Delete all records one by one
    while (recordCount > 0) {
      // Always delete the first record (index 0)
      await crudPage.clickDeleteButton(0);
      
      // Wait a bit for the deletion to process to update DOM
      //TODO This could be improved to not rely on thread sleeps
      await page.waitForTimeout(200);
      
      // Get updated count
      recordCount = await crudPage.getRecordCount();
    }

    // Verify no records are visible
    expect(recordCount).toBe(0);

    // Verify "no users" message is displayed
    await expect(crudPage.getNoUsersMessage()).toBeVisible();
    expect(await crudPage.isNoUsersMessageVisible()).toBe(true);
  });
});
