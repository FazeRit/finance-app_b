import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getSecureStatus(): boolean {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    return nodeEnv === 'production';
  }
}
