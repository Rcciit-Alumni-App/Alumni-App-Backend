import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Token } from 'utils/decorators/token.decorator';

@Controller('user/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/details')
  async getProfile(@Token() token: string) {
    return this.profileService.getProfile(token);
  }
}
