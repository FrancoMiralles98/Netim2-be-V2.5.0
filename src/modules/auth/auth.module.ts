import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './services/token.service';
import { UserService } from '../user/user.service';
import { AuthGuard } from './guards/auth-guards.guard';

@Module({
  imports: [
    JwtModule.register({}),
    UserService
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService
  ],
  exports: [
    AuthService,
    TokenService,
    AuthGuard
  ]
})
export class AuthModule { }
