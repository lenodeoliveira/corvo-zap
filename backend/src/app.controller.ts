
import { Controller, Get } from '@nestjs/common';

@Controller('/healthy-check')
export class AppController {
  @Get()
  healthyCheck(): string {
    return '✅ healthy-check';
  }
}