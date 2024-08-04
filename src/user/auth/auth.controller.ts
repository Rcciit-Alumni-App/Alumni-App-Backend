import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, ResetPasswordDto, SignupDto, VerifyDto } from './dto';
import { verifyRollNo } from 'utils/auth/verify_roll_no';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Authentication Flow')
@Controller('user/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({
      status: 201,
      description: 'User registered successfully',
      schema: {
        type: 'object',
        properties: {
          verificationToken: {
            type: 'string',
            example: '<jwt-token>',
          },
        },
      },
    })
    @ApiResponse({
      status: 401,
      description: 'User already exists',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'User already exists',
          },
          error: {
            type: 'string',
            example: 'Unauthorized',
          },
          statusCode: {
            type: 'number',
            example: 401,
          },
        },
      },
    })
    @Post("/signup")
    async register(@Body() signupDto: SignupDto) {
        if (verifyRollNo(signupDto.college_roll, signupDto.college_email))
            return await this.authService.signup(signupDto);
        else
            throw new UnauthorizedException("Invalid information....Please check credentials");
    }

    @ApiOperation({ summary: 'Verify a user with OTP' })
  @ApiResponse({
    status: 200,
    description: 'User verified successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: '<jwt-token>',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Wrong OTP',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Wrong OTP',
        },
        error: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'number',
          example: 401,
        },
      },
    },
  })
    @Post("/verify")
    async verify(@Body() verifyDto: VerifyDto) {
        return await this.authService.verify(verifyDto);
    }

    @ApiOperation({ summary: 'Login a user' })
    @ApiResponse({
      status: 200,
      description: 'Login successful',
      schema: {
        type: 'object',
        properties: {
          access_token: {
            type: 'string',
            example: '<jwt-token>',
          },
        },
      },
    })
    @ApiResponse({
      status: 401,
      description: 'User does not exist',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'User does not exist',
          },
          error: {
            type: 'string',
            example: 'Unauthorized',
          },
          statusCode: {
            type: 'number',
            example: 401,
          },
        },
      },
    })
    @ApiResponse({
      status: 401,
      description: 'Invalid Password',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Invalid Password',
          },
          error: {
            type: 'string',
            example: 'Unauthorized',
          },
          statusCode: {
            type: 'number',
            example: 401,
          },
        },
      },
    })
    @Post('/login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }


    @ApiOperation({ summary: 'Request a password reset' })
  @ApiResponse({
    status: 200,
    description: 'Password reset requested successfully',
    schema: {
      type: 'object',
      properties: {
        verificationToken: {
          type: 'string',
          example: '<jwt-token>',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'User does not exist',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User does not exist',
        },
        error: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'number',
          example: 401,
        },
      },
    },
  })
    @Post('/forgot-password')
    async forgotPassword(@Body() data: {email: string}) {
        return this.authService.forgotPassword(data.email);
    }


    @ApiOperation({ summary: 'Reset a user password' })
    @ApiResponse({
      status: 200,
      description: 'Password reset successfully',
      schema: {
        type: 'object',
        properties: {
          access_token: {
            type: 'string',
            example: '<jwt-token>',
          },
        },
      },
    })
    @ApiResponse({
      status: 401,
      description: 'Wrong OTP',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Wrong OTP',
          },
          error: {
            type: 'string',
            example: 'Unauthorized',
          },
          statusCode: {
            type: 'number',
            example: 401,
          },
        },
      },
    })
    @Post('/reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }


}
