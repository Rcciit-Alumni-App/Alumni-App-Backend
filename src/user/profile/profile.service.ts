import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { decodeToken } from 'utils/auth/decodeToken';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async getProfile(token: string) {
    const userId = decodeToken(token, this.jwt, this.config);
    const userProfile = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userProfile) {
      throw new UnauthorizedException('User not found');
    }
    return userProfile;
  }
}
