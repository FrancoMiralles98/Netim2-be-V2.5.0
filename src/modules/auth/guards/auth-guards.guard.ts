import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRequest } from '../types/request/auth-request.type';
import { TokenService } from '../services/token.service';

/**
 * Guard encargado de validar la autenticación del usuario mediante refresh token.
 *
 * Obtiene el refresh token desde las cookies del request, lo verifica usando
 * `TokenService` y, si el token es válido, agrega la información autenticada
 * del usuario al request.
 *
 * @throws UnauthorizedException Si el token no existe, es inválido o su payload
 * no contiene la información mínima requerida.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest<AuthRequest>()

    const token = request.cookies?.refresh_token

    const payload = await this.tokenService.verifyRefreshToken(token)

    if (!payload.sub || !payload.authSessionId) {
      throw new UnauthorizedException('Invalid token payload')
    }

    request.user = {
      accountId: payload.sub,
      authSessionId: payload.authSessionId
    }


    return true;
  }
}
