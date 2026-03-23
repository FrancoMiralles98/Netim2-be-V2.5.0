import { registerAs } from "@nestjs/config";
import { AppConfigType } from "./types/app-config.type";
import { NodeEnv } from "./types/node-env.enum";

export const databaseConfig = registerAs("db",(): AppConfigType["db"]=>{
    const nodeEnv = process.env.NODE_ENV
    const uriToUse = nodeEnv === NodeEnv.DEVELOPMENT 
    ? process.env.DB_URI_PROD
    : process.env.DB_URI_DEV

    if (!uriToUse) {
        throw new Error("Not uri founded to use")
    }

    return {
        uri: uriToUse
    }
})