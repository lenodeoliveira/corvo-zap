import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

type CommonDatabaseConfig = {
  synchronize?: boolean;
  dropSchema?: boolean;
  entities?: DataSourceOptions['entities'];
};

type SqliteDatabaseConfig = CommonDatabaseConfig & {
  type: 'sqlite';
  database: string;
};

type MysqlDatabaseConfig = CommonDatabaseConfig & {
  type: 'mysql';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

type PostgresDatabaseConfig = CommonDatabaseConfig & {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  schema?: string;
  ssl?: boolean;
};

export type SupportedDatabaseConfig =
  | SqliteDatabaseConfig
  | MysqlDatabaseConfig
  | PostgresDatabaseConfig;

type SupportedDatabaseType = SupportedDatabaseConfig['type'];

function getSharedDatabaseOptions(
  config: SupportedDatabaseConfig,
): Pick<DataSourceOptions, 'entities' | 'synchronize' | 'dropSchema'> {
  return {
    entities: config.entities ?? [],
    synchronize: config.synchronize ?? true,
    dropSchema: config.dropSchema ?? false,
  };
}

function requireEnv(configService: ConfigService, key: string): string {
  const value = configService.get<string>(key);

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function buildDatabaseConfigFromEnv(
  configService: ConfigService,
  entities: DataSourceOptions['entities'],
): SupportedDatabaseConfig {
  const type = configService.get<SupportedDatabaseType>('DB_TYPE', 'sqlite');

  const common = {
    entities,
    synchronize: configService.get<string>('DB_SYNCHRONIZE', 'true') !== 'false',
    dropSchema: configService.get<string>('DB_DROP_SCHEMA', 'false') === 'true',
  };

  switch (type) {
    case 'sqlite':
      return {
        type: 'sqlite',
        database: configService.get<string>('DB_DATABASE', 'corvozap.sqlite'),
        ...common,
      };

    case 'mysql':
      return {
        type: 'mysql',
        host: requireEnv(configService, 'DB_HOST'),
        port: configService.get<number>('DB_PORT', 3306),
        username: requireEnv(configService, 'DB_USERNAME'),
        password: requireEnv(configService, 'DB_PASSWORD'),
        database: requireEnv(configService, 'DB_DATABASE'),
        ...common,
      };

    case 'postgres':
      return {
        type: 'postgres',
        host: requireEnv(configService, 'DB_HOST'),
        port: configService.get<number>('DB_PORT', 5432),
        username: requireEnv(configService, 'DB_USERNAME'),
        password: requireEnv(configService, 'DB_PASSWORD'),
        database: requireEnv(configService, 'DB_DATABASE'),
        schema: configService.get<string>('DB_SCHEMA'),
        ssl: configService.get<string>('DB_SSL', 'false') === 'true',
        ...common,
      };

    default:
      throw new Error(`Unsupported DB_TYPE: ${type as string}`);
  }
}

export function createDatabaseOptions(
  config: SupportedDatabaseConfig,
): TypeOrmModuleOptions {
  const sharedOptions = getSharedDatabaseOptions(config);

  switch (config.type) {
    case 'sqlite':
      return {
        type: 'sqlite',
        database: config.database,
        ...sharedOptions,
      };

    case 'mysql':
      return {
        type: 'mysql',
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        ...sharedOptions,
      };

    case 'postgres':
      return {
        type: 'postgres',
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        schema: config.schema,
        ssl: config.ssl,
        ...sharedOptions,
      };
  }
}

export function createDataSource(config: SupportedDatabaseConfig) {
  return new DataSource(createDatabaseOptions(config) as DataSourceOptions);
}
