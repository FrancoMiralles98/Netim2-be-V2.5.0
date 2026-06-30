import { RequestWithCookies } from "./request-with-cookies.type"

export type AuthRequest =  RequestWithCookies & {
    user: {
        accountId: string,
        authSessionId: string
    }
}