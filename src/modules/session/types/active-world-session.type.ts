export interface ActiveWorldSession {
    accountId: string;
    authSessionId: string;
    characterId: string;
    socketId: string;
    worldSessionId: string;
    connectedAt: number;
}

export type DataToConnectWorld  = Omit<ActiveWorldSession,'connectedAt' | 'worldSessionId'>