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
  };
  db: {
    uri: string;
  };
}
