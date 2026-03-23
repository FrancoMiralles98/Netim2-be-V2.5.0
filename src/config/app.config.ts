import { registerAs } from '@nestjs/config';
import { AppConfigType } from './types/app-config.type';
import { NodeEnv } from './types/node-env.enum';

export const appConfig = registerAs('', (): AppConfigType['app'] => ({
    node_env: process.env.NODE_ENV as NodeEnv,
    port: Number(process.env.PORT)
}));
