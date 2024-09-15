import { Module } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PasswordManger } from 'src/utils/password.utils';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [UserService, PasswordManger],
})
export class AuthModule {}
