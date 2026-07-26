import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ChatModule } from './modules/chat/chat.module';
import { MessagesModule } from './modules/messages/messages.module';
import { MessagingQueryModule } from './modules/messaging-query/messaging-query.module';
import { CitiesModule } from './modules/cities/cities.module';
import { DATABASE_ENTITIES } from './shared/infra/database/typeorm/entities';
import {
  buildDatabaseConfigFromEnv,
  createDatabaseOptions,
} from './shared/infra/database/typeorm/config/database.providers';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfileModule } from './modules/profile/profile.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { EventsModule } from './modules/events/events.module';
import { RealtimeModule } from './modules/realtime/realtime.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createDatabaseOptions(
          buildDatabaseConfigFromEnv(configService, DATABASE_ENTITIES),
        ),
    }),
    AuthModule,
    UsersModule,
    ProfileModule,
    ChatModule,
    MessagesModule,
    MessagingQueryModule,
    CitiesModule,
    DeliveryModule,
    EventsModule,
    RealtimeModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
