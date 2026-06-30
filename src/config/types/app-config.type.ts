import { NodeEnv } from './node-env.enum';

export interface AppConfigType {
  app: {
    port?: number;
    node_env?: NodeEnv;
  };
  auth: {
    jwt_access_secret?: string;
    jwt_access_expires?: string;
    jwt_refresh_secret?: string;
    jwt_refresh_expires?: string;
    jwt_access_cookie_max_age: number;
    jwt_refresh_cookie_max_age: number
  };
  db: {
    uri: string;
  };
  redis: {
    url?: string;
    refresh_ttl: number;
  }
}
