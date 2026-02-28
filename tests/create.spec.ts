import { test, expect } from '../fixtures/pageFixtures';
import { DataFactory } from '../utils/DataFactory';

test.describe('Create New User', () => {
  
  test.beforeEach(async ({ crudPage }) => {
    await crudPage.navigate();
    await crudPage.verifyPageLoaded();
    expect(await crudPage.isInAddMode()).toBe(true);
  });

  test('should create a new user and add to view users table', async ({ crudPage }) => {
    // Get initial count of users in the table
    const initialCount = await crudPage.getRecordCount();

    // Generate test user data
    const testUser = DataFactory.generateUserData();

    // Create new user record
    await crudPage.createRecord(testUser);

    // Verify record count increased by 1
    const newCount = await crudPage.getRecordCount();
    expect(newCount).toBe(initialCount + 1);

    // Verify the new user appears in the table
    const userRow = crudPage.getRowByText(testUser.name);
    await expect(userRow).toBeVisible();

    // Verify all data is correctly displayed in the table
    await expect(userRow).toContainText(testUser.name);
    await expect(userRow).toContainText(testUser.profession);
    await expect(userRow).toContainText(testUser.dob);
  });

  test.describe('Name Input Validations', () => {
    
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
      
      // Verify add button is disabled due to validation error
      await expect(crudPage.getAddButton()).toBeDisabled();
      
      // Verify form is still in add mode
      await expect(crudPage.getAddHeading()).toBeVisible();
    });

    test('should accept name with exactly 4 characters', async ({ crudPage }) => {
      const minValidName = 'John'; 
      const initialCount = await crudPage.getRecordCount();
      const testUser = DataFactory.generateUserData();
      
      await crudPage.selectGender(testUser.gender);
      await crudPage.fillName(minValidName);
      await crudPage.fillProfession(testUser.profession);
      await crudPage.fillDob(testUser.dob);

      await crudPage.clickAddButton();

      // Verify the user was added
      const newCount = await crudPage.getRecordCount();
      expect(newCount).toBe(initialCount + 1);
      
      const userRow = crudPage.getRowByText(minValidName);
      await expect(userRow).toBeVisible();
    });

    test('should accept name with exactly 16 characters', async ({ crudPage }) => {
      const maxValidName = 'A'.repeat(16);
      const initialCount = await crudPage.getRecordCount();
      const testUser = DataFactory.generateUserData();
      
      await crudPage.selectGender(testUser.gender);
      await crudPage.fillName(maxValidName);
      await crudPage.fillProfession(testUser.profession);
      await crudPage.fillDob(testUser.dob);

      await crudPage.clickAddButton();

      // Verify the user was added
      const newCount = await crudPage.getRecordCount();
      expect(newCount).toBe(initialCount + 1);
      
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
      
      // Verify add button is disabled due to validation error
      await expect(crudPage.getAddButton()).toBeDisabled();
      
      // Verify form is still in add mode
      await expect(crudPage.getAddHeading()).toBeVisible();
    });
  });

  test.describe('Required Input Validations', () => {
    
    test('should disable add button when name is empty', async ({ crudPage }) => {
      // Fill only profession (name is empty)
      await crudPage.fillProfession(DataFactory.generateProfession());

      // Verify add button is disabled
      await expect(crudPage.getAddButton()).toBeDisabled();
    });

    test('should disable add button when profession is empty', async ({ crudPage }) => {
      // Fill only name (profession is empty)
      await crudPage.fillName(DataFactory.generateFirstName());

      // Verify add button is disabled
      await expect(crudPage.getAddButton()).toBeDisabled();
    });

    test('should disable add button when both name and profession are empty', async ({ crudPage }) => {
      // Don't fill any required fields
      // Verify add button is disabled
      await expect(crudPage.getAddButton()).toBeDisabled();
    });

    test('should disable add button after clearing name field', async ({ crudPage }) => {
      // Fill both fields first
      await crudPage.fillName(DataFactory.generateFirstName());
      await crudPage.fillProfession(DataFactory.generateProfession());
      
      // Verify button is enabled
      await expect(crudPage.getAddButton()).toBeEnabled();

      // Clear name field
      await crudPage.fillName('');

      // Verify add button is now disabled
      await expect(crudPage.getAddButton()).toBeDisabled();
    });

    test('should disable add button after clearing profession field', async ({ crudPage }) => {
      // Fill both fields first
      await crudPage.fillName(DataFactory.generateFirstName());
      await crudPage.fillProfession(DataFactory.generateProfession());
      
      // Verify button is enabled
      await expect(crudPage.getAddButton()).toBeEnabled();

      // Clear profession field
      await crudPage.fillProfession('');

      // Verify add button is now disabled
      await expect(crudPage.getAddButton()).toBeDisabled();
    });
  });
});
