import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionGateway } from './session.gateway';
import { CharacterModule } from '../character/character.module';
import { RedisModule } from '../redis/redis.module';
import { AuthModule } from '../auth/auth.module';
import { ActiveWorldSessionGuard } from './guard/active-world-session.guard';

@Module({
  imports: [
    RedisModule,
    AuthModule,
    CharacterModule
  ],
  providers: [SessionGateway, SessionService,ActiveWorldSessionGuard],
  exports: [SessionService,ActiveWorldSessionGuard]
})
export class SessionModule {}
