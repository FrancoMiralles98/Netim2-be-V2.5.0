import { Request } from "express";
import { CookieNames } from "../cookie-names.enum";

export type RequestWithCookies = Request & {
    cookies?: Record<CookieNames,string>
} 