import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user-dto';
import { Throttle } from '@nestjs/throttler';
import { REGISTER_THROTTLER } from 'src/config/throttlers';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Throttle({ default: REGISTER_THROTTLER })
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    await this.userService.createUser(body)
    return {
      message: 'Usuario registrado exitosamente'
    }
  }
}
