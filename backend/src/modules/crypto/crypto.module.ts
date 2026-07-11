import { Module } from "@nestjs/common";
import { CryptoMessageService } from "./crypto.message.service";

@Module({
  imports: [],
  providers: [CryptoMessageService],
  exports: [CryptoMessageService],
})
export class CryptoModule {}