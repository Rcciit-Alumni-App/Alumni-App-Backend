import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { decodeToken } from '../../../utils/auth/decodeToken';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { RedisService } from '../../../src/redis/redis.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) { }

  async getProfile(token: string) {
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
  }

  async updateProfile(token: string, data: any) {
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
    if (data?.stream) {
      delete data.stream;
      message += 'Stream cannot be updated. ';
    }
    if (data?.college_roll) {
      delete data.college_roll;
      message += 'College roll cannot be updated. ';
    }

    data.internships.map((internship) => {
      delete internship.id;
      delete internship.description;

      internship.end_date = internship.end_date ?? undefined;
    });

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
  }
}
