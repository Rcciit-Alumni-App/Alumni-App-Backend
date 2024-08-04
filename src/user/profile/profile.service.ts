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

  async getProfile(token: string):Promise<UserDto> {
    const userId = decodeToken(token, this.jwt, this.config);
    const userProfile = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userProfile) {
      throw new UnauthorizedException('User not found');
    }
    return userProfile;
  }

  async updateProfile(token: string, data: any): Promise<UserDto> {
    const userId = decodeToken(token, this.jwt, this.config);

    // Handle the Prisma update
    const updatedData = {...data};
    const updatedProfile = await this.prisma.user.update({
      where: { id: userId },
      data:updatedData,
    });
  
    return updatedProfile;
  }
  
  
  
  
}
