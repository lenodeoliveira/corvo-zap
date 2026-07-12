import { Module } from '@nestjs/common';
import { CRYPT_SERVICE } from './infra/tokens/crypt.token.service';
import { CryptInfraService } from './infra/services/crypt.infra.service';

@Module({
  providers: [
    {
      provide: CRYPT_SERVICE,
      useClass: CryptInfraService,
    },
  ],
  exports: [CRYPT_SERVICE],
})
export class PasswordModule {}
