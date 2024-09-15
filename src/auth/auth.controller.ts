import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from 'src/dtos/createUser.dto';
import { UserService } from 'src/user/user.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('/register')
  @Render('auth/register')
  fetchUi() {
    const viewData = [];
    viewData['title'] = 'User Register - Online Store';
    viewData['subtitle'] = 'User Register';
    return { viewData: viewData };
  }

  @Post('/register')
  @UseInterceptors(ClassSerializerInterceptor)
  @Redirect('/')
  async craete(@Body() createUserDTO: CreateUserDTO) {
    await this.userService.create(createUserDTO);
  }
}
