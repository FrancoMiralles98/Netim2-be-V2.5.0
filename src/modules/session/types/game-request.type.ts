import { AuthRequest } from "src/modules/auth/types/request/auth-request.type";

export interface GameRequest extends AuthRequest {
    activeCharacterId: string;
    worldSessionId: string
}