import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { DATABASE_ENTITIES } from './shared/infra/database/typeorm/entities';
import { ConfigModule } from '@nestjs/config';
import { UserModel } from './modules/users/infra/database/sqlite/model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(
      {
        type: 'sqlite',
        database: 'corvozap.sqlite',
        entities: DATABASE_ENTITIES,
        synchronize: true, 
      },
    ),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
