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

function getSharedDatabaseOptions(
  config: SupportedDatabaseConfig,
): Pick<DataSourceOptions, 'entities' | 'synchronize' | 'dropSchema'> {
  return {
    entities: config.entities ?? [],
    synchronize: config.synchronize ?? true,
    dropSchema: config.dropSchema ?? false,
  };
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

export function createDatabaseProvider(config: SupportedDatabaseConfig) {
  return {
    provide: 'DATA_SOURCE',
    useFactory: async () => createDataSource(config).initialize(),
  };
}

export const databaseProviders = [
  createDatabaseProvider({
    type: 'sqlite',
    database: 'database.sqlite',
  }),
];
