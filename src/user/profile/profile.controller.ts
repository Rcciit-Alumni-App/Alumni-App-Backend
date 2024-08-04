import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Token } from 'utils/decorators/token.decorator';
import { UpdateUserDto, UserDto } from './dto/profile.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Profile Flow')
@Controller('user/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Token') 
  @Get('/details')
  @ApiOperation({
    summary: 'Retrieve user profile details',
    description: 'Fetches the profile details of the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the profile details.',
    type: UserDto, 
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Invalid or expired token.',
    schema: {
      example: {
        message: 'Invalid or expired token',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  async getProfile(@Token() token: string) {
    return this.profileService.getProfile(token);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Token')
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the profile details.',
    type: UserDto, 
  })
  @ApiOperation({
    summary: 'Update user profile details',
    description: 'Updates the profile details of the authenticated user.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Invalid or expired token.',
    schema: {
      example: {
        message: 'Invalid or expired token',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @Put('/update')
  async updateProfile(
    @Token() token: string,
    @Body() data: UpdateUserDto,
  ) {
    return this.profileService.updateProfile(token,data);
  }
}
