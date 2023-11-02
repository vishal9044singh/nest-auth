import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';

@ValidatorConstraint({ name: 'isMobileNumber', async: false })
export class IsMobileNumberConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value === 'number') {
      // Convert the number to a string and check if it has exactly 10 digits.
      const valueString = value.toString();
      return /^\d{10}$/.test(valueString);
    }
    return false; // Not a number, validation fails.
  }

  defaultMessage() {
    return 'Please enter a valid mobile number!';
  }
}

export function IsMobileNumber() {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isMobileNumber',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      validator: IsMobileNumberConstraint,
    });
  };
}