import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './services/token.service';
import { AuthGuard } from './guards/auth-guards.guard';
import { UserModule } from '../user/user.module';
import { RedisModule } from '../redis/redis.module';
import { AccessTokenGuard } from './guards/access-token.guard';

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
    AuthGuard,
    AccessTokenGuard
  ],
  exports: [
    AuthService,
    TokenService,
    AuthGuard,
    AccessTokenGuard
  ]
})
export class AuthModule { }
