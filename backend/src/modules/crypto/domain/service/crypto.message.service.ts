import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, createHash } from 'crypto';

@Injectable()
class CryptoMessageService {
  constructor(private readonly configService: ConfigService) {}

  private getKeyAndIv(): { key: Buffer; iv: Buffer } {
    const cryptoKey = this.configService.get('CRYPTO_KEY');
    const cryptoIv = this.configService.get('CRYPTO_IV');

    if (!cryptoKey || !cryptoIv) {
      throw new Error('CRYPTO_KEY and CRYPTO_IV must be defined in environment variables');
    }

    return {
      key: createHash('sha256').update(cryptoKey).digest(),
      iv: createHash('sha256').update(cryptoIv).digest().subarray(0, 16),
    };
  }

  encrypt(message: string): string {
    const { key, iv } = this.getKeyAndIv();
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    return cipher.update(message, 'utf8', 'hex') + cipher.final('hex');
  }

  decrypt(encryptedMessage: string): string {
    const { key, iv } = this.getKeyAndIv();
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    return decipher.update(encryptedMessage, 'hex', 'utf8') + decipher.final('utf8');
  }
}

export { CryptoMessageService };
