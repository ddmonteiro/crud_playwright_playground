import { faker } from '@faker-js/faker';
import { format } from 'date-fns';

export interface UserData {
  gender: string;
  name: string;
  profession: string;
  dob: string;
}

export class DataFactory {
  private static readonly MIN_NAME_LENGTH = 4;
  private static readonly MAX_NAME_LENGTH = 16;
  private static readonly MIN_AGE = 0;
  private static readonly MAX_AGE = 200; //FIXME There is no maximum age set on app
  private static readonly GENDERS = ['female', 'male', 'other'];

  static generateGender(): string {
    return this.GENDERS[Math.floor(Math.random() * this.GENDERS.length)];
  }

  static generateFirstName(): string {
    let firstName = faker.person.firstName();
    
    // Ensure name meets validation requirements
    while (
      firstName.length < this.MIN_NAME_LENGTH || 
      firstName.length > this.MAX_NAME_LENGTH
    ) {
      firstName = faker.person.firstName();
    }
    
    return firstName;
  }

  static generateProfession(): string {
    return faker.person.jobTitle();
  }

  static generateDateOfBirth(): string {
    const birthDate = faker.date.birthdate({ 
      mode: 'age', 
      min: this.MIN_AGE, 
      max: this.MAX_AGE 
    });
    
    return format(birthDate, 'yyyy-MM-dd');
  }

  static generateUserData(): UserData {
    return {
      gender: this.generateGender(),
      name: this.generateFirstName(),
      profession: this.generateProfession(),
      dob: this.generateDateOfBirth()
    };
  }
}
