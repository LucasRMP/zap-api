import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  authenticate(payload: any): string {
    try {
      const token = this.jwt.sign(payload, {
        secret: this.config.get('SALT'),
        expiresIn: '1y',
      });

      return token;
    } catch {
      throw new Error('An error ocurred while signing the token');
    }
  }

  verify(token: string) {
    return this.jwt.verify(token, { secret: this.config.get('SALT') });
  }
}
