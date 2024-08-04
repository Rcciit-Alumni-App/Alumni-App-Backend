import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

export function decodeToken(token: string, jwt: JwtService, config: ConfigService): string {
  try {
    const secret = config.get<string>('JWT_AUTHENTICATION_SECRET');
    const decoded = jwt.verify(token, { secret });
    return decoded.sub;
  } catch (error) {
    throw new UnauthorizedException('Invalid or expired token');
  }
}
