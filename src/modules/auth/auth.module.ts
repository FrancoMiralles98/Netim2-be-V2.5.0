import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './services/token.service';
import { AuthGuard } from './guards/auth-guards.guard';
import { UserModule } from '../user/user.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    JwtModule.register({}),
    UserModule,
    RedisModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    AuthGuard
  ],
  exports: [
    AuthService,
    TokenService,
    AuthGuard
  ]
})
export class AuthModule { }
