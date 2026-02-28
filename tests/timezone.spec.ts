import { test, expect } from '../fixtures/pageFixtures';
import { DataFactory } from '../utils/DataFactory';

const timezones = [
  { name: 'London', id: 'Europe/London' },
  { name: 'New York', id: 'America/New_York' },
  { name: 'Tokyo', id: 'Asia/Tokyo' },
  { name: 'Sydney', id: 'Australia/Sydney' },
  { name: 'Los Angeles', id: 'America/Los_Angeles' }
];

const users = [
  { name: 'Tom Jones', expectedDOB: '2000-01-20' },
  { name: 'Bob Smith', expectedDOB: '1989-01-20' }
];

timezones.forEach((timezone) => {
  test.describe(`Timezone: ${timezone.name}`, () => {
    test.use({ timezoneId: timezone.id });

    users.forEach((user) => {
      test(`should display consistent DOB for existent record ${user.name}`, async ({ crudPage }) => {
        await crudPage.navigate();

        const dobText = await crudPage.getDobFromUser(user.name);

        expect(dobText).toContain(user.expectedDOB);
      });
    });

    test(`should store DOB correctly when creating a new record`, async ({ crudPage }) => {
      await crudPage.navigate();

      const testUser = {
        gender: DataFactory.generateGender(),
        name: DataFactory.generateFirstName(),
        profession: DataFactory.generateProfession(),
        dob: '1995-06-15'
      };

      await crudPage.createRecord(testUser);

      const storedDob = await crudPage.getDobFromUser(testUser.name);

      expect(storedDob).toBe('1995-06-15');
    });
  });
});