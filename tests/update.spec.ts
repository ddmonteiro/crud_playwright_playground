import { test, expect } from '../fixtures/pageFixtures';
import { DataFactory } from '../utils/DataFactory';

const EXISTING_RECORD = 'Bob Smith';

test.describe('Update User', () => {
  
  test.beforeEach(async ({ crudPage }) => {
    await crudPage.navigate();
    await crudPage.verifyPageLoaded();
  });

  test('should update existing user record Bob Smith', async ({ crudPage }) => {
    // Click edit button for Bob Smith
    await crudPage.clickEditButtonForUser(EXISTING_RECORD);
    
    // Verify we're in edit mode
    expect(await crudPage.isInEditMode()).toBe(true);
    await expect(crudPage.getEditHeading()).toBeVisible();

    // Generate new test data for update
    const updatedData = DataFactory.generateUserData();

    // Update the record
    await crudPage.selectGender(updatedData.gender);
    await crudPage.fillName(updatedData.name);
    await crudPage.fillProfession(updatedData.profession);
    await crudPage.fillDob(updatedData.dob);
    await crudPage.clickUpdateButton();

    // Verify the user data has been updated in the table
    const userRow = crudPage.getRowByText(updatedData.name);
    await expect(userRow).toBeVisible();
    await expect(userRow).toContainText(updatedData.name);
    await expect(userRow).toContainText(updatedData.profession);
    await expect(userRow).toContainText(updatedData.dob);

    // Verify old name is no longer in the table
    const oldUserRow = crudPage.getRowByText(EXISTING_RECORD);
    await expect(oldUserRow).not.toBeVisible();
  });

  test('should close edit mode when cancel button is clicked', async ({ crudPage }) => {
    // Click edit button for Bob Smith
    await crudPage.clickEditButtonForUser(EXISTING_RECORD);
    
    // Verify we're in edit mode
    expect(await crudPage.isInEditMode()).toBe(true);
    await expect(crudPage.getEditHeading()).toBeVisible();

    // Click cancel button
    await crudPage.clickCancelButton();

    // Verify we're no longer in edit mode
    expect(await crudPage.isInEditMode()).toBe(false);
    
    // Verify add mode is visible (back to main form)
    expect(await crudPage.isInAddMode()).toBe(true);
    await expect(crudPage.getAddHeading()).toBeVisible();
  });

  test.describe('Name Input Validations', () => {
    
    test.beforeEach(async ({ crudPage }) => {
      // Enter edit mode for Bob Smith before each validation test
      await crudPage.clickEditButtonForUser(EXISTING_RECORD);
      expect(await crudPage.isInEditMode()).toBe(true);
    });

    test('should reject name with less than 4 characters', async ({ crudPage }) => {
      const shortName = 'Tom';
      const testUser = DataFactory.generateUserData();
      
      await crudPage.selectGender(testUser.gender);
      await crudPage.fillName(shortName);
      await crudPage.fillProfession(testUser.profession);
      await crudPage.fillDob(testUser.dob);

      // Verify validation error message is displayed
      const errorMessage = crudPage.getValidationError('name is too short');
      await expect(errorMessage).toBeVisible();
      
      // Verify update button is disabled due to validation error
      await expect(crudPage.getUpdateButton()).toBeDisabled();
      
      // Verify form is still in edit mode
      await expect(crudPage.getEditHeading()).toBeVisible();
    });

    test('should accept name with exactly 4 characters', async ({ crudPage }) => {
      const minValidName = 'John';
      const testUser = DataFactory.generateUserData();
      
      await crudPage.selectGender(testUser.gender);
      await crudPage.fillName(minValidName);
      await crudPage.fillProfession(testUser.profession);
      await crudPage.fillDob(testUser.dob);

      await crudPage.clickUpdateButton();

      // Verify the user was updated
      const userRow = crudPage.getRowByText(minValidName);
      await expect(userRow).toBeVisible();
    });

    test('should accept name with exactly 16 characters', async ({ crudPage }) => {
      const maxValidName = 'A'.repeat(16);
      const testUser = DataFactory.generateUserData();
      
      await crudPage.selectGender(testUser.gender);
      await crudPage.fillName(maxValidName);
      await crudPage.fillProfession(testUser.profession);
      await crudPage.fillDob(testUser.dob);

      await crudPage.clickUpdateButton();

      // Verify the user was updated
      const userRow = crudPage.getRowByText(maxValidName);
      await expect(userRow).toBeVisible();
    });

    test('should reject name with more than 16 characters', async ({ crudPage }) => {
      const longName = 'A'.repeat(17); 
      const testUser = DataFactory.generateUserData();
      
      await crudPage.selectGender(testUser.gender);
      await crudPage.fillName(longName);
      await crudPage.fillProfession(testUser.profession);
      await crudPage.fillDob(testUser.dob);

      // Verify validation error message is displayed
      const errorMessage = crudPage.getValidationError('name is too long');
      await expect(errorMessage).toBeVisible();
      
      // Verify update button is disabled due to validation error
      await expect(crudPage.getUpdateButton()).toBeDisabled();
      
      // Verify form is still in edit mode
      await expect(crudPage.getEditHeading()).toBeVisible();
    });
  });

  test.describe('Required Input Validations', () => {
    
    test.beforeEach(async ({ crudPage }) => {
      // Enter edit mode for Bob Smith before each validation test
      await crudPage.clickEditButtonForUser(EXISTING_RECORD);
      expect(await crudPage.isInEditMode()).toBe(true);
    });

    test('should disable update button when name is empty', async ({ crudPage }) => {
      // Clear name field and fill only profession
      await crudPage.fillName('');

      // Verify update button is disabled
      await expect(crudPage.getUpdateButton()).toBeDisabled();
    });

    test('should disable update button when profession is empty', async ({ crudPage }) => {
      await crudPage.fillProfession('');

      // Verify update button is disabled
      await expect(crudPage.getUpdateButton()).toBeDisabled();
    });

    test('should disable update button when both name and profession are empty', async ({ crudPage }) => {
      // Clear both required fields
      await crudPage.fillName('');
      await crudPage.fillProfession('');
      
      // Verify update button is disabled
      await expect(crudPage.getUpdateButton()).toBeDisabled();
    });
  });
});
