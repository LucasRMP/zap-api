import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly auth: AuthService) {}

  use(req: any, res: any, next: () => void) {
    const { query } = req.body;

    if (query.includes('login') && query.startsWith('mutation')) {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('User not authenticated.');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer') {
      throw new UnauthorizedException('Malformed token.');
    }

    try {
      const decoded = this.auth.verify(token);

      req.user = decoded;
      return next();
    } catch (err) {
      throw new UnauthorizedException('Invalid token.');
    }
  }
}
