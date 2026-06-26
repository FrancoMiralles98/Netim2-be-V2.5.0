export interface AccessTokenPayload {
    sub: string;
    authSessionId: string;
    type: 'access'
}

export interface RefreshTokenPayload {
    sub: string;
    authSessionId: string;
    type: 'refresh'
}