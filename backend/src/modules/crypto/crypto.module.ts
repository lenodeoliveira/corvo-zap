import { Module } from '@nestjs/common';
import { CryptoMessageService } from './domain/service/crypto.message.service';

@Module({
  imports: [],
  providers: [CryptoMessageService],
  exports: [CryptoMessageService],
})
export class CryptoModule {}
