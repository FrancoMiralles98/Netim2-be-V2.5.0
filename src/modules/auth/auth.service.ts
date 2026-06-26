import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from './services/token.service';
import { RedisService } from '../redis/redis.service';
import { UserService } from '../user/user.service';
import { randomUUID } from 'crypto';
import { REFRESH_SESSION_TTL_SECONDS } from './const/refresh-session-ttl.const';

@Injectable()
export class AuthService {
    constructor(
        private tokenService: TokenService,
        private redisService: RedisService,
        private userService: UserService,
    ) { }

    async login(email: string, password: string) {
        const user = await this.userService.validateCredentials(email, password)
        const authSessionId = randomUUID()

        await this.redisService.client.set(
            this.getRefreshSessionKey(authSessionId),
            user._id.toString(),
            'EX',
            REFRESH_SESSION_TTL_SECONDS
        )

        const accessToken = await this.tokenService.signAccessToken(user.id, authSessionId);
        const refreshToken = await this.tokenService.signRefreshToken(user.id, authSessionId);

        return { accessToken, refreshToken }
    }

    async refresh(refreshToken?: string) {
        const payload = await this.tokenService.verifyRefreshToken(refreshToken)

        const accountId = await this.redisService.client.get(
            this.getRefreshSessionKey(payload.authSessionId)
        )


        if (!accountId || accountId !== payload.sub) {
            throw new UnauthorizedException('Refresh session expired');
        }

        const newAccessToken = this.tokenService.signAccessToken(accountId, payload.authSessionId)

        return newAccessToken
    }

    async logout(refreshToken?: string) {
        const payload = await this.tokenService.verifyRefreshToken(refreshToken)

        await this.redisService.client.del(
            this.getRefreshSessionKey(payload.authSessionId),
        );

        await this.redisService.client.del(`active:account:${payload.sub}`);
    }


    private getRefreshSessionKey(authSessionId: string): string {
        return `refresh:session:${authSessionId}`;
    }
}
