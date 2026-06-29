import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SessionService } from './session.service';
import { Injectable } from '@nestjs/common';
import { CharacterService } from '../character/character.service';
import { Server } from 'socket.io';
import { parseCookie } from 'cookie'
import { AuthSocket } from './types/auth-socket.type';
import { CookieNames } from '../auth/types/cookie-names.enum';
import { TokenService } from '../auth/services/token.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.URL_FRONT,
    credentials: true
  },
  transports: ['websocket']
})
export class SessionGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  private  server!: Server

  private readonly heartbeatIntervals = new Map<string, NodeJS.Timeout>();

  constructor(
    private sessionService: SessionService,
    private tokenService: TokenService,
    private characterService: CharacterService,
  ) { }

  async afterInit(server: Server) {
    server.use(async (socket: AuthSocket, next) => {
      try {
        const cookies = parseCookie(socket.handshake.headers.cookie ?? '')
        const access_token = cookies[CookieNames.ACCESS_TOKEN]

        const payload = await this.tokenService.verifyAccessToken(access_token)

        const characterId = socket.handshake.auth?.characterId

        if (!characterId || typeof characterId !== 'string') {
          throw new Error('Character id missing');
        }

        const isCharacterOwner = this.characterService.validateCharacterOwnership(payload.sub, characterId)

        if (!isCharacterOwner) {
          throw new Error('Invalid character owner')
        }

        socket.data.accountId = payload.sub;
        socket.data.authSessionId = payload.authSessionId;
        socket.data.characterId = characterId;

        next()
      } catch (error) {
        next(new Error('UNAUTHORIZED'));
      }
    })
  }

  async handleConnection(client: AuthSocket) {
    const result = await this.sessionService.connectWorld({
      accountId: client.data.accountId,
      authSessionId: client.data.authSessionId,
      characterId: client.data.characterId,
      socketId: client.id,
    });

    client.data.worldSessionId = result.worldSessionId


    if (result.previousSocketId && result.previousSocketId !== client.id) {
      this.server.to(result.previousSocketId).emit('session:replaced');

      const previousSocket = this.server.sockets.sockets.get(result.previousSocketId);

      previousSocket?.disconnect(true);
    }

    client.emit('session:ready', {
      worldSessionId: result.worldSessionId,
      characterId: client.data.characterId,
    });

    const interval = setInterval(async () => {
      if (!client.data.worldSessionId) {
        return;
      }

      const renewed = await this.sessionService.renewWorldSession({
        accountId: client.data.accountId,
        characterId: client.data.characterId,
        socketId: client.id,
        worldSessionId: client.data.worldSessionId,
      });

      if (!renewed) {
        client.emit('session:expired');
        client.disconnect(true);
      }
    }, 30_000);

    this.heartbeatIntervals.set(client.id, interval);
  }

  async handleDisconnect(client: AuthSocket) {
    const interval = this.heartbeatIntervals.get(client.id);

    if (interval) {
      clearInterval(interval);
      this.heartbeatIntervals.delete(client.id);
    }

    await this.sessionService.disconnectSocket(client.id);
  }

}
