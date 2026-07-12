import { Module } from '@nestjs/common';
import { ProfileControllers } from './interfaces/http/controllers/profile.controllers';
import { GetProfileService } from './application/usecases/get-profile/get.profile.service';
import { UsersModule } from '../users/users.module';
import { CitiesModule } from '../cities/cities.module';

@Module({
  imports: [UsersModule, CitiesModule],
  controllers: [ProfileControllers],
  providers: [GetProfileService],
})
export class ProfileModule {}
