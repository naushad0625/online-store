import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { CreateUserDTO } from 'src/dtos/createUser.dto';
import { UserAc } from 'src/models/user.entity';
import { PasswordManger } from 'src/utils/password.utils';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserAc) private userRepository: Repository<UserAc>,
    @Inject() private passwordManager: PasswordManger,
  ) {}

  async create(createUserDto: CreateUserDTO) {
    const user: UserAc = new UserAc();
    const { name, email, password, role } = createUserDto;

    this.passwordManager
      .hash(password)
      .then((hash: string) => {
        user.setName(name);
        user.setEmail(email);
        user.setPassword(hash);
        if (role) user.setRole(role);

        return this.userRepository.save(user);
      })
      .then((createdUser) => {
        log(createdUser);
      })
      .catch((err) => {
        log(err);
        throw new InternalServerErrorException({ message: err.message });
      });
  }
}
