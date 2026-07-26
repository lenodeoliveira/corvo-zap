import { BadRequestException, Injectable } from "@nestjs/common";
import IContentEncryption from "../../domain/gateways/content.encryption";
import { createCipheriv, createDecipheriv, createHash } from 'crypto';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ContentEncryptionService implements IContentEncryption {
  private key: string | undefined;
  private iv: string | undefined;
  constructor(private readonly configService: ConfigService) {}

   encryptContent(content: string): string {
    const { key, iv } = this.getKeyAndIv();
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    return cipher.update(content, 'utf8', 'hex') + cipher.final('hex');
  }

   decryptContent(encryptedContent: string): string {
    const { key, iv } = this.getKeyAndIv();
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    return decipher.update(encryptedContent, 'hex', 'utf8') + decipher.final('utf8');
  }

  private getKeyAndIv(): { key: Buffer; iv: Buffer } {
    if (!this.key || !this.iv) {
          this.key = this.configService.get('CRYPTO_KEY');
          this.iv = this.configService.get('CRYPTO_IV');
    }

    if (!this.key || !this.iv) {
      throw new BadRequestException('CRYPTO_KEY and CRYPTO_IV must be defined in environment variables');
    }

    return {
      key: createHash('sha256').update(this.key).digest(),
      iv: createHash('sha256').update(this.iv).digest().subarray(0, 16),
    };
  }
}