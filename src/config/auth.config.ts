import { registerAs } from "@nestjs/config";
import { AppConfigType } from "./types/app-config.type";

export const authConfig = registerAs("auth", (): AppConfigType["auth"]=> ({
    jwt_access_expires: process.env.JWT_ACCESS_EXPIRES,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_expires: process.env.REFRESH_EXPIRES,
    jwt_refresh_secret: process.env.REFRESH_SECRET
}))