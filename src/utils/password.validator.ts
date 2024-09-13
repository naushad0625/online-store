import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
class IsPasswordValidConatraints implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    const testresult = this.test(password);

    if (!testresult) return false;
    const {
      hasDigit,
      hasUpperCase,
      hasLowercase,
      hasSpecialChar,
      isValidLength,
    } = testresult;
    return (
      hasDigit &&
      hasUpperCase &&
      hasLowercase &&
      hasSpecialChar &&
      isValidLength
    );
  }

  defaultMessage(args?: ValidationArguments): string {
    const { value } = args;
    const testresult = this.test(value);
    if (!testresult) {
      return 'Password must not be empty.';
    } else {
      const {
        hasDigit,
        hasUpperCase,
        hasLowercase,
        hasSpecialChar,
        isValidLength,
      } = testresult;

      let message = 'Password must: ';
      if (!hasDigit) message += ' contain at least 1 digit,';
      if (!hasUpperCase) message += ' contain at least 1 uppercase letter,';
      if (!hasLowercase) message += ' contain at least 1 lowercase letter,';
      if (!hasSpecialChar) message += ' cntain at least 1 special character,';
      if (!isValidLength)
        message += ' contain minimum 8 characters and maximum 15 characters';

      message = message.replace(/,\s*$/, '.') || 'Password is invalid.';
      return message;
    }
  }

  test(password: string):
    | false
    | {
        hasDigit: boolean;
        hasUpperCase: boolean;
        hasLowercase: boolean;
        hasSpecialChar: boolean;
        isValidLength: boolean;
      } {
    if (!password) return false;
    const hasDigit = /\d/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasSpecialChar = /[\W_]/.test(password);
    const isValidLength = password.length >= 8 && password.length <= 15;
    return {
      hasDigit,
      hasUpperCase,
      hasLowercase,
      hasSpecialChar,
      isValidLength,
    };
  }
}

export default function IsValidPassword(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsPasswordValidConatraints,
    });
  };
}
