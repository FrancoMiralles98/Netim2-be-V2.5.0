import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { SessionService } from "../session.service";
import { GameRequest } from "../types/game-request.type";

@Injectable()
export class ActiveWorldSessionGuard implements CanActivate {
    constructor(
        private sessionService: SessionService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<GameRequest>()

        const worldSessionId = request.headers['x-world-session-id']

        if (!worldSessionId || Array.isArray(worldSessionId)) {
            throw new UnauthorizedException('World session missing');
        }

        const activeSession = await this.sessionService.getActiveSessionByAccount(request.user.accountId)

        if (!activeSession) {
            throw new UnauthorizedException('No active world session');
        }

        if (activeSession.worldSessionId !== worldSessionId) {
            throw new UnauthorizedException('World session replaced');
        }

        request.activeCharacterId = activeSession.characterId;
        request.worldSessionId = worldSessionId;

        return true
    }
}