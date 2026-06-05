import * as Joi from "joi";
import { NodeEnv } from "./types/node-env.enum";

export const envValidationSchema = Joi.object({
    PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string()
        .valid(...Object.values(NodeEnv))
        .default(NodeEnv.DEVELOPMENT),
    JWT_ACCESS_SECRET: Joi.string().required(),
    JWT_ACCESS_EXPIRES: Joi.string().required(),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_REFRESH_EXPIRES: Joi.string().required(),
    DB_URI_DEV: Joi.string().uri().required(),
    DB_URI_PROD: Joi.string().uri().required(),
})