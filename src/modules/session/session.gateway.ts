import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SessionService } from './session.service';
import { Injectable } from '@nestjs/common';
import { CharacterService } from '../character/character.service';
import { Server } from 'socket.io';
import { parse } from 'cookie'
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
  private server!: Server

  private readonly heartbeatIntervals = new Map<string, NodeJS.Timeout>();

  constructor(
    private sessionService: SessionService,
    private tokenService: TokenService,
    private characterService: CharacterService,
  ) { }

  /**
  * Inicializa el middleware de autenticación del servidor WebSocket.
  *
  * Este middleware se ejecuta antes de aceptar una nueva conexión socket.
  *
  * Flujo de validación:
  * - Lee las cookies enviadas durante el handshake inicial.
  * - Obtiene el access token desde las cookies.
  * - Verifica y decodifica el access token.
  * - Obtiene el `characterId` enviado desde `socket.handshake.auth`.
  * - Valida que el `characterId` pertenezca a la cuenta autenticada.
  * - Guarda los datos autenticados en `socket.data` para usarlos luego
  *   en eventos, guards o lógica del gateway.
  *
  * Si alguna validación falla, la conexión WebSocket es rechazada.
  *
  * @param server Instancia del servidor Socket.IO inicializada por NestJS.
  */
  afterInit(server: Server): void {
    server.use((socket: AuthSocket, next) => {
      void this.authenticateSocket(socket,next)
    })
  }

  private async authenticateSocket(
    socket: AuthSocket,
    next: (err?: Error) => void,
  ): Promise<void> {
    try {
      const cookies = parse(socket.handshake.headers.cookie ?? '');
      const accessToken = cookies[CookieNames.ACCESS_TOKEN];

      if (!accessToken) {
        return next(new Error('ACCESS_TOKEN_MISSING'));
      }

      const payload = await this.tokenService.verifyAccessToken(accessToken);

      const characterId = socket.handshake.auth?.characterId;

      if (!characterId || typeof characterId !== 'string') {
        return next(new Error('CHARACTER_ID_MISSING'));
      }

      const isCharacterOwner = await this.characterService.validateCharacterOwnership(characterId,payload.sub);

      if (!isCharacterOwner) {
        return next(new Error('INVALID_CHARACTER_OWNER'));
      }

      socket.data.accountId = payload.sub;
      socket.data.authSessionId = payload.authSessionId;
      socket.data.characterId = characterId;

      next();
    } catch (error) {
      console.error('Socket auth error:', error);
      next(new Error('UNAUTHORIZED'));
    }
  }

  /**
  * Maneja la conexión inicial de un socket autenticado al mundo.
  *
  * Este método se ejecuta cuando un cliente WebSocket se conecta correctamente
  * luego de pasar por el middleware de autenticación del gateway.
  *
  * Registra la sesión activa del jugador en Redis usando los datos previamente
  * guardados en `client.data`, como la cuenta autenticada, la sesión de auth,
  * el personaje seleccionado y el ID del socket actual.
  *
  * Si la cuenta ya tenía una sesión activa anterior, se notifica al socket previo
  * que su sesión fue reemplazada y luego se lo desconecta. Esto evita que una
  * misma cuenta o personaje permanezca conectado desde más de un socket al mismo
  * tiempo.
  *
  * Una vez registrada la nueva sesión, se emite el evento `session:ready` al
  * cliente actual para informarle que la conexión al mundo quedó inicializada
  * correctamente.
  *
  * También inicia un heartbeat periódico que renueva la sesión en Redis cada
  * 30 segundos. Si la renovación falla, significa que la sesión ya no es válida,
  * fue reemplazada o expiró, por lo que se emite `session:expired` y se
  * desconecta el socket.
  *
  * El intervalo creado se guarda en `heartbeatIntervals` para poder limpiarlo
  * posteriormente cuando el socket se desconecte.
  *
  * @param client Socket autenticado que acaba de conectarse al gateway.
  *
  * @returns No retorna ningún valor.
  */
  async handleConnection(client: AuthSocket) {
    //registrar sesion en redis
    const result = await this.sessionService.connectWorld({
      accountId: client.data.accountId,
      authSessionId: client.data.authSessionId,
      characterId: client.data.characterId,
      socketId: client.id,
    });

    //guarda el worldSessionId en el socket
    client.data.worldSessionId = result.worldSessionId

    //Si habia un socket anterior lo desconecta
    if (result.previousSocketId && result.previousSocketId !== client.id) {
      this.server.to(result.previousSocketId).emit('session:replaced');

      const previousSocket = this.server.sockets.sockets.get(result.previousSocketId);

      previousSocket?.disconnect(true);
    }

    client.emit('session:ready', {
      worldSessionId: result.worldSessionId,
      characterId: client.data.characterId,
    });

    //Para renovar la session de Redis
    const interval = setInterval(async () => {
      try {
        if (!client.data.worldSessionId) {
          return
        }

        const renewed = await this.sessionService.renewWorldSession({
          accountId: client.data.accountId,
          characterId: client.data.characterId,
          socketId: client.id,
          worldSessionId: client.data.worldSessionId,
        })

        if (!renewed) {
          client.emit('session:expired')
          client.disconnect(true)
        }
      } catch {
        client.emit('session:expired')
        client.disconnect(true)
      }
    }, 30_000);

    this.heartbeatIntervals.set(client.id, interval);
  }

  /**
  * Maneja la desconexión de un socket autenticado.
  *
  * Este método se ejecuta cuando un cliente WebSocket se desconecta del gateway.
  *
  * Primero busca el intervalo de heartbeat asociado al socket y, si existe,
  * lo detiene usando `clearInterval` para evitar que siga intentando renovar
  * una sesión que ya no está activa.
  *
  * Luego elimina la referencia del intervalo del mapa `heartbeatIntervals`
  * para liberar memoria y mantener limpio el registro interno de conexiones.
  *
  * Finalmente, delega en `SessionService` la limpieza de la sesión asociada
  * al socket en Redis, eliminando las claves correspondientes cuando la sesión
  * desconectada sigue siendo la sesión activa actual.
  *
  * @param client Socket autenticado que acaba de desconectarse.
  *
  * @returns No retorna ningún valor.
  */
  async handleDisconnect(client: AuthSocket) {
    const interval = this.heartbeatIntervals.get(client.id);

    if (interval) {
      clearInterval(interval);
      this.heartbeatIntervals.delete(client.id);
    }

    await this.sessionService.disconnectSocket(client.id);
  }

}
