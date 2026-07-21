import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { TokenService } from "../services/token.service";
import { AuthRequest } from "../types/request/auth-request.type";

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(
        private readonly tokenService: TokenService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthRequest>();

        const token = request.cookies?.access_token;
        
        const payload = await this.tokenService.verifyAccessToken(token);

        if (!payload.sub || !payload.authSessionId) {
            throw new UnauthorizedException('Invalid token payload');
        }

        request.user = {
            accountId: payload.sub,
            authSessionId: payload.authSessionId,
        };

        return true;
    }
}