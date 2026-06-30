import { Socket } from "socket.io";

export type AuthSocket = Socket & {
    data: {
        accountId: string;
        authSessionId: string;
        characterId: string;
        worldSessionId?: string;
    };
}