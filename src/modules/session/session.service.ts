import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { ActiveWorldSession, DataToConnectWorld } from './types/active-world-session.type';
import { randomUUID } from 'crypto';
import { ACTIVE_SESSION_TTL_SECONDS } from './const/active-session-ttl.const';

@Injectable()
export class SessionService {
    constructor(
        private redisService: RedisService
    ) { }

    /**
    * Conecta una cuenta/personaje al mundo y registra su sesión activa.
    *
    * Crea una nueva sesión de mundo para el socket conectado y guarda en Redis
    * las referencias necesarias para consultar y administrar el estado online
    * desde distintos identificadores.
    *
    * Antes de crear la nueva sesión, busca si la cuenta ya tenía una sesión activa.
    * En caso de existir, devuelve el `socketId` anterior para que pueda ser
    * desconectado o reemplazado desde el gateway.
    *
    * Todas las claves se guardan con TTL para evitar sesiones fantasma si el
    * cliente se desconecta de forma inesperada o el servidor no llega a limpiar
    * manualmente la sesión.
    *
    * @param data Datos necesarios para conectar la cuenta/personaje al mundo.
    *
    * @returns Objeto con el ID de la nueva sesión de mundo y, si existía,
    * el socket anterior asociado a la cuenta.
    */
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

        await this.redisService.client
            .multi()
            // permite saber si una cuenta ya tiene una sesión conectada.
            .set(
                this.getActiveAccountKey(data.accountId),
                JSON.stringify(activeSession),
                'EX',
                ACTIVE_SESSION_TTL_SECONDS
            )

            // permite saber si un personaje está actualmente conectado.
            .set(
                this.getOnlineCharacterKey(data.characterId),
                JSON.stringify(worldSessionId),
                'EX',
                ACTIVE_SESSION_TTL_SECONDS
            )

            // permite identificar qué cuenta/personaje pertenece a un socket cuando ocurre una desconexión.
            .set(
                this.getSocketKey(data.socketId),
                JSON.stringify({
                    accountId: data.accountId,
                    characterId: data.characterId,
                    worldSessionId
                }),
                'EX',
                ACTIVE_SESSION_TTL_SECONDS
            )
            .exec()

        return {
            worldSessionId,
            previousSocketId: previousSession?.socketId
        }
    }

    /**
    * Renueva el tiempo de vida de una sesión activa de mundo
    *
    * Primero obtiene la sesión activa asociada a la cuenta y valida que la
    * sesión recibida corresponda a la sesión actual registrada en Redis.
    *
    * La renovación solo se realiza si coinciden:
    * - El `worldSessionId` recibido con el de la sesión activa.
    * - El `socketId` recibido con el de la sesión activa.
    *
    * Si la sesión es válida, se renueva el TTL de las claves relacionadas:
    * - Cuenta activa.
    * - Personaje online.
    * - Socket activo.
    *
    * @param data Datos necesarios para identificar y renovar la sesión activa.
    * @param data.accountId ID de la cuenta autenticada.
    * @param data.characterId ID del personaje conectado al mundo.
    * @param data.socketId ID del socket actual.
    * @param data.worldSessionId ID de la sesión de mundo actual.
    *
    * @returns `true` si la sesión fue validada y renovada correctamente.
    * `false` si no existe una sesión activa o si los datos no coinciden con
    * la sesión actual.
    */
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

        //Se renuevan los tiempos de expiracion de cada key
        await this.redisService.client.multi()
            .expire(
                this.getActiveAccountKey(data.accountId),
                ACTIVE_SESSION_TTL_SECONDS,
            )
            .expire(
                this.getOnlineCharacterKey(data.characterId),
                ACTIVE_SESSION_TTL_SECONDS,
            )
            .expire(
                this.getSocketKey(data.socketId),
                ACTIVE_SESSION_TTL_SECONDS,
            )
            .exec()

        return true;
    }

    /**
    * Desconecta y limpia la información asociada a un socket en Redis.
    *
    * Este método se ejecuta cuando un socket se desconecta del mundo.
    * Primero obtiene la sesión asociada al `socketId` para saber a qué cuenta,
    * personaje y sesión de mundo pertenecía ese socket.
    *
    * La clave del socket se elimina siempre, ya que representa una conexión
    * específica que dejó de estar activa.
    *
    * Luego valida si la sesión activa actual de la cuenta sigue siendo la misma
    * sesión asociada al socket desconectado. Esta validación evita que una
    * conexión vieja borre una sesión nueva que pudo haberse creado después,
    * por ejemplo al refrescar la página o abrir otra conexión.
    *
    * Si la sesión coincide, se eliminan también las claves de:
    * - Cuenta activa.
    * - Personaje online.
    *
    * @param socketId ID del socket desconectado.
    *
    * @returns No retorna ningún valor.
    */
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
            await this.redisService.client
                .multi()
                .del(this.getActiveAccountKey(socketSession.accountId))
                .del(this.getOnlineCharacterKey(socketSession.characterId))
                .exec()
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