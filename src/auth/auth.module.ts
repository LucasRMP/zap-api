import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [JwtModule.register({ secret: process.env.SALT })],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
