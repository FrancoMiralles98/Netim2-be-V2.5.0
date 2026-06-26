import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AppConfigType } from "src/config/types/app-config.type";
import { AccessTokenPayload, RefreshTokenPayload } from "../types/token.types";
import type { StringValue } from 'ms'

@Injectable()
export class TokenService {
    constructor(
        private jwtService: JwtService,
        private config: ConfigService<AppConfigType>
    ) { }

    async signAccessToken(accountId: string, authSessionId: string): Promise<string> {
        return await this.jwtService.signAsync(
            {
                sub: accountId,
                authSessionId,
                type: 'access',

            } satisfies AccessTokenPayload,
            {
                secret: this.config.getOrThrow('auth', { infer: true }).jwt_access_secret,
                expiresIn: this.config.getOrThrow('auth', { infer: true }).jwt_access_expires as StringValue ?? '15m'
            }
        )
    }

    async signRefreshToken(accountId: string, authSessionId: string): Promise<string> {
        return await this.jwtService.signAsync(
            {
                sub: accountId,
                authSessionId,
                type: 'refresh',
            } satisfies RefreshTokenPayload,
            {
                secret: this.config.getOrThrow('auth', { infer: true }).jwt_refresh_secret,
                expiresIn: this.config.getOrThrow('auth', { infer: true }).jwt_refresh_expires as StringValue ?? '15m',
            },
        );
    }

    async verifyAccessToken(token?: string): Promise<AccessTokenPayload> {
        if (!token) {
            throw new UnauthorizedException('Access Token missing')
        }

        const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(token, {
            secret: this.config.getOrThrow('auth', { infer: true }).jwt_access_secret,
        })

        if (payload.type !== 'access') {
            throw new UnauthorizedException('token invalido')
        }

        return payload
    }

    async verifyRefreshToken(token?: string): Promise<RefreshTokenPayload> {
        if (!token) {
            throw new UnauthorizedException('Refresh token missing');
        }

        const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(token, {
            secret: this.config.getOrThrow('auth',{infer:true}).jwt_refresh_secret,
        });

        if (payload.type !== 'refresh') {
            throw new UnauthorizedException('Invalid refresh token');
        }

        return payload;
    }




}