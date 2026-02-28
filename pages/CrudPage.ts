import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CrudPage extends BasePage {
  // Locators
  private readonly addButton = 'button:has-text("Add new user")';
  private readonly updateButton = 'button:has-text("Update")';
  private readonly editButton = 'button:has-text("edit")';
  private readonly deleteButton = 'button:has-text("delete")';
  private readonly cancelButton = 'button:has-text("Cancel")';
  
  // Form fields - CRUD Playground specific
  private readonly genderDropdown = 'select, [role="combobox"]';
  private readonly nameInput = 'input[placeholder="please input name"]';
  private readonly professionInput = 'input[placeholder="please input profession"]';
  
  // Table/List elements
  private readonly tableRows = 'table tbody tr';
  
  // Form headings
  private readonly addHeading = 'h1:has-text("Add users")';
  private readonly editHeading = 'h1:has-text("edit users")';

  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState();
  }

  async clickAddButton(): Promise<void> {
    await this.page.locator(this.addButton).click();
  }

  async clickUpdateButton(): Promise<void> {
    await this.page.locator(this.updateButton).click();
  }

  async selectGender(gender: string): Promise<void> {
    await this.page.locator(this.genderDropdown).selectOption(gender);
  }

  async fillName(name: string): Promise<void> {
    await this.page.locator(this.nameInput).fill(name);
  }

  async fillProfession(profession: string): Promise<void> {
    await this.page.locator(this.professionInput).fill(profession);
  }

  async fillDob(dob: string): Promise<void> {
    // DOB field is the 3rd textbox (index 2) on the page
    await this.page.getByRole('textbox').nth(2).fill(dob);
  }

  async clickCancelButton(): Promise<void> {
    await this.page.locator(this.cancelButton).click();
  }

  async createRecord(data: { 
    gender: string; 
    name: string; 
    profession: string; 
    dob: string;
  }): Promise<void> {
    await this.selectGender(data.gender);
    await this.fillName(data.name);
    await this.fillProfession(data.profession);
    await this.fillDob(data.dob);
    
    await this.clickAddButton();
  }

  async clickEditButtonForUser(userName: string): Promise<void> {
    const userRow = this.getRowByText(userName);
    const editButton = userRow.locator(this.editButton);
    await editButton.click();
  }

  async clickDeleteButton(rowIndex: number = 0): Promise<void> {
    const deleteButtons = this.page.locator(this.deleteButton);
    await deleteButtons.nth(rowIndex).click();
  }

  async clickDeleteButtonForUser(userName: string): Promise<void> {
    const userRow = this.getRowByText(userName);
    const deleteButton = userRow.locator(this.deleteButton);
    await deleteButton.click();
  }

  async getRecordCount(): Promise<number> {
    //Excludes the "no users" row by filtering for rows with delete buttons
    const deleteButtons = await this.page.locator(this.deleteButton).count();
    return deleteButtons;
  }

  getRowByText(searchText: string) {
    return this.page.locator('tr', { hasText: searchText });
  }

  async getDobFromUser(userName: string): Promise<string> {
    const userRow = this.getRowByText(userName);
    const dobCell = userRow.locator('td').nth(2);
    return (await dobCell.textContent()) ?? '';
  }

  async verifyPageLoaded(): Promise<void> {
    await this.page.locator(this.appHeading).waitFor();
  }

  async isInEditMode(): Promise<boolean> {
    try {
      return await this.page.locator(this.editHeading).isVisible();
    } catch {
      return false;
    }
  }

  async isInAddMode(): Promise<boolean> {
    try {
      return await this.page.locator(this.addHeading).isVisible();
    } catch {
      return false;
    }
  }

  getAddButton() {
    return this.page.locator(this.addButton);
  }

  getValidationError(message: string) {
    return this.page.locator(`.form-error:has-text("${message}")`);
  }

  getAddHeading() {
    return this.page.locator(this.addHeading);
  }

  getUpdateButton() {
    return this.page.locator(this.updateButton);
  }

  getEditHeading() {
    return this.page.locator(this.editHeading);
  }

  getNoUsersMessage() {
    return this.page.getByText('no users');
  }

  async isNoUsersMessageVisible(): Promise<boolean> {
    return await this.getNoUsersMessage().isVisible();
  }
}

