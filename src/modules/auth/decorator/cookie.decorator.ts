import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { CookieNames } from "../types/cookie-names.enum";
import { RequestWithCookies } from "../types/request/request-with-cookies.type";

/**
 * Decorator de parámetro para obtener una cookie específica del request.
 *
 * Recibe el nombre de una cookie y devuelve su valor si existe dentro
 * de `request.cookies`
 */
export const ReqCookies = createParamDecorator((
    cookieName: CookieNames,
    ctx: ExecutionContext
): string | undefined => {
    const request = ctx.switchToHttp().getRequest<RequestWithCookies>()
    return request.cookies?.[cookieName]
})