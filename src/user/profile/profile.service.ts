import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { decodeToken } from 'utils/auth/decodeToken';
import { RedisService } from 'src/redis/redis.service';
import { InternalServerError } from 'utils/errors/server-error';
import { UserDto } from './dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) { }

  async getProfile(token: string): Promise<UserDto> {
    try {
      const userId = decodeToken(token, this.jwt, this.config);
      const user = await this.redis.getValue(userId);
      if (user)
        return user;
      const userProfile = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      delete userProfile.password;

      if (!userProfile) {
        throw new UnauthorizedException('User not found');
      }
      return userProfile;
    } catch (error) {
      throw new InternalServerError();
    }
  }

  async updateProfile(token: string, data: any): Promise<{ message: string; updatedProfile: UserDto }> {
    try {
      const userId = decodeToken(token, this.jwt, this.config);
      let message = '';
      if (data?.personal_mail) {

        delete data.personal_mail;
        message += 'Personal email cannot be updated. ';
      }
      if (data?.college_mail) {
        delete data.college_mail;
        message += 'College email cannot be updated. ';
      }

      const updatedData = { ...data };

      const updatedProfile = await this.prisma.user.update({
        where: { id: userId },
        data: updatedData,
      });

      delete updatedProfile.password;

      return {
        message: message + 'Profile updated successfully.',
        updatedProfile,
      };
    } catch (error) {
      throw new InternalServerError();
    }
  }
}
