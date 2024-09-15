import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordManger {
  constructor(private configService: ConfigService) {}

  async hash(password: string): Promise<string> {
    const saltRounds: number = Number(
      this.configService.get<number>('SALT_ROUNDS'),
    );

    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
