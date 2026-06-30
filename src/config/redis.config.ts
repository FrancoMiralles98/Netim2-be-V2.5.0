import { registerAs } from "@nestjs/config";
import { AppConfigType } from "./types/app-config.type";

export const redisConfig = registerAs('redis', (): AppConfigType['redis'] => {
    return {
        url: process.env.REDIS_URL,
        refresh_ttl: 7 * 24 * 60 * 60,
    }
})