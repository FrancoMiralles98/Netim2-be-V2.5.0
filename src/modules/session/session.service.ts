import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { ActiveWorldSession, DataToConnectWorld } from './types/active-world-session.type';
import { randomUUID } from 'crypto';

@Injectable()
export class SessionService {
    constructor(
        private redisService: RedisService
    ) { }

    async connectWorld(data: DataToConnectWorld): Promise<{ worldSessionId: string, previousSocketId?: string }> {
        const previousSession = await this.getActiveSessionByAccount(data.accountId)

        const worldSessionId = randomUUID()

        const activeSession: ActiveWorldSession = {
            accountId: data.accountId,
            authSessionId: data.authSessionId,
            characterId: data.characterId,
            socketId: data.socketId,
            connectedAt: Date.now(),
            worldSessionId
        }

        await this.redisService.client.set(
            this.getActiveAccountKey(data.accountId),
            JSON.stringify(activeSession),
            'EX',
            ACTIVE_SESSION_TTL_SECONDS
        )

        await this.redisService.client.set(
            this.getOnlineCharacterKey(data.characterId),
            JSON.stringify(worldSessionId),
            'EX',
            ACTIVE_SESSION_TTL_SECONDS
        )

        await this.redisService.client.set(
            this.getSocketKey(data.socketId),
            JSON.stringify({
                accountId: data.accountId,
                characterId: data.characterId,
                worldSessionId
            }),
            'EX',
            ACTIVE_SESSION_TTL_SECONDS
        )

        return {
            worldSessionId,
            previousSocketId: previousSession?.socketId
        }
    }

    async renewWorldSession(data: {
        accountId: string;
        characterId: string;
        socketId: string;
        worldSessionId: string;
    }): Promise<boolean> {
        const activeSession = await this.getActiveSessionByAccount(data.accountId);

        if (!activeSession) {
            return false;
        }

        if (
            activeSession.worldSessionId !== data.worldSessionId ||
            activeSession.socketId !== data.socketId
        ) {
            return false;
        }

        await this.redisService.client.expire(
            this.getActiveAccountKey(data.accountId),
            ACTIVE_SESSION_TTL_SECONDS,
        );

        await this.redisService.client.expire(
            this.getOnlineCharacterKey(data.characterId),
            ACTIVE_SESSION_TTL_SECONDS,
        );

        await this.redisService.client.expire(
            this.getSocketKey(data.socketId),
            ACTIVE_SESSION_TTL_SECONDS,
        );

        return true;
    }

    async disconnectSocket(socketId: string): Promise<void> {
        const socketSessionRaw = await this.redisService.client.get(
            this.getSocketKey(socketId),
        );

        if (!socketSessionRaw) {
            return;
        }

        const socketSession = JSON.parse(socketSessionRaw) as {
            accountId: string;
            characterId: string;
            worldSessionId: string;
        };

        const activeSession = await this.getActiveSessionByAccount(
            socketSession.accountId,
        );

        await this.redisService.client.del(this.getSocketKey(socketId));

        /* Esto evita que una conexión vieja borre una sesión nueva.*/
        if (
            activeSession &&
            activeSession.worldSessionId === socketSession.worldSessionId
        ) {
            await this.redisService.client.del(
                this.getActiveAccountKey(socketSession.accountId),
            );

            await this.redisService.client.del(
                this.getOnlineCharacterKey(socketSession.characterId),
            );
        }
    }

    async isCharacterOnline(characterId: string): Promise<boolean> {
        const result = await this.redisService.client.exists(
            this.getOnlineCharacterKey(characterId),
        );

        return result === 1;
    }

    async getActiveSessionByAccount(accountId: string,): Promise<ActiveWorldSession | null> {
        const data = await this.redisService.client.get(this.getActiveAccountKey(accountId))

        if (!data) {
            return null;
        }

        return JSON.parse(data) as ActiveWorldSession;
    }


    private getActiveAccountKey(accountId: string): string {
        return `active:account:${accountId}`;
    }

    private getOnlineCharacterKey(characterId: string): string {
        return `online:character:${characterId}`;
    }

    private getSocketKey(socketId: string): string {
        return `socket:${socketId}`;
    }

}