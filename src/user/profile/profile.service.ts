import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { decodeToken } from 'utils/auth/decodeToken';
import { UserDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async getProfile(token: string): Promise<UserDto> {
    const userId = decodeToken(token, this.jwt, this.config);
    const userProfile = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userProfile) {
      throw new UnauthorizedException('User not found');
    }
    return userProfile;
  }

  async updateProfile(token: string, data: any): Promise<{ message: string; updatedProfile: UserDto }> {
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
    console.log(message);
  
    return {
      message: message + 'Profile updated successfully.',
      updatedProfile,
    };
  }
  
  
}
