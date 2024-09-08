import { validate } from 'class-validator';
import IsValidPassword from './password.validator';

describe('IsValidPassword', () => {
  class CreateUserDTO {
    @IsValidPassword()
    password: string;
  }

  it('should validate when password is correct', () => {
    const createUserDTO = new CreateUserDTO();
    createUserDTO.password = 'Bangladesh_01@.';

    validate(createUserDTO).then((errors) => {
      expect(errors.length).toEqual(0);
    });
  });

  it('should fail if no digit is given', () => {
    const createUserDTO = new CreateUserDTO();
    createUserDTO.password = 'Bangladesh@$#';

    validate(createUserDTO).then((errors) => {
      expect(errors.length).toBe(1);
    });
  });

  it('should fail if no Uppercase letter is given', () => {
    const createUserDTO = new CreateUserDTO();
    createUserDTO.password = 'bangladesh01@$#';

    validate(createUserDTO).then((errors) => {
      expect(errors.length).toBe(1);
    });
  });

  it('should fail if no Lowerercase letter is given', () => {
    const createUserDTO = new CreateUserDTO();
    createUserDTO.password = 'BANGLADESH01@$#';

    validate(createUserDTO).then((errors) => {
      expect(errors.length).toBe(1);
    });
  });

  it('should fail if no Special character is given', () => {
    const createUserDTO = new CreateUserDTO();
    createUserDTO.password = 'Bangladesh01';

    validate(createUserDTO).then((errors) => {
      expect(errors.length).toBe(1);
    });
  });

  it('should fail if length is < 8', () => {
    const createUserDTO = new CreateUserDTO();
    createUserDTO.password = 'Abc@01';

    validate(createUserDTO).then((errors) => {
      expect(errors.length).toBe(1);
    });
  });

  it('should fail if length is > 15', () => {
    const createUserDTO = new CreateUserDTO();
    createUserDTO.password = 'Bangladesh01Bangladesh01@#$';

    validate(createUserDTO).then((errors) => {
      expect(errors.length).toBe(1);
    });
  });
});
