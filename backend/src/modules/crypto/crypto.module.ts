import { Module } from '@nestjs/common';
import { ContentEncryptionService } from './infra/gateway/content.encryption.service';
import { CONTENT_ENCRYPTION_SERVICE } from './domain/tokens/content.encryption.token';

@Module({
  imports: [],
  providers: [{
    provide: CONTENT_ENCRYPTION_SERVICE,
    useClass: ContentEncryptionService,
  }],
  exports: [CONTENT_ENCRYPTION_SERVICE],
})
export class CryptoModule {}
