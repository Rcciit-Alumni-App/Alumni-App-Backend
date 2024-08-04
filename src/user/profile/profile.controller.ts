import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Token } from 'utils/decorators/token.decorator';
import { UpdateUserDto } from './dto/profile.dto';

@Controller('user/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/details')
  async getProfile(@Token() token: string) {
    return this.profileService.getProfile(token);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update')
  async updateProfile(
    @Token() token: string,
    @Body() data: UpdateUserDto,
  ) {
    return this.profileService.updateProfile(token,data);
  }
}
