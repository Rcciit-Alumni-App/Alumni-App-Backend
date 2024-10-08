import { Body, Controller, Delete, Post, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, ResetPasswordDto, SignupDto, UpdatePasswordDto, VerifyDto } from './dto';
import { AuthService } from './auth.service';
import { verifyRollNo } from '../../../utils/auth/verify_roll_no';
import { Token } from '../../../utils/decorators/token.decorator';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from './guards';
import { Role, Roles } from 'utils/decorators/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FILE_UPLOAD_DIR } from 'utils/constants';
import { filenameEditor } from 'utils/file/file-name-editor';
import { imageFileFilter } from 'utils/file/image-file-filter';
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

  @ApiOperation({ summary: 'Resend OTP', description: 'Allows the user to request a resend of their OTP.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          description: 'JWT or session token to identify the user',
        },
      },
      required: ['token'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'OTP has been resent successfully.',
    schema: {
      example: {
        message: 'OTP has been resent successfully.',
      },
    },
  })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests. You have exceeded the limit of OTP resend requests.',
    schema: {
      example: {
        statusCode: 429,
        message: 'Too Many Requests',
        error: 'Too Many Requests',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. The token is invalid or expired.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. Something went wrong on the server.',
  })
  @Throttle({ deafult: { ttl: 60000, limit: 2 } })
  @Post("/resend-otp")
  async resendOTP(@Body() { token }: { token: string }) {
    return this.authService.resendOTP(token);
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

  @Delete("/logout")
  @ApiOperation({ summary: 'Logout', description: 'Logs out the user by invalidating their session or token.' })
  @ApiBearerAuth() // This indicates that this endpoint requires a bearer token in the Authorization header
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out.',
    schema: {
      example: {
        message: 'Logged out successfully.',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. The token is invalid or expired.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. Something went wrong on the server.',
  })
  async logout(@Token() token: string) {
    this.authService.logout(token);
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
  async forgotPassword(@Body() data: { email: string }) {
    return this.authService.forgotPassword(data.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/reset-password")
  @ApiOperation({
    summary: 'Reset Password',
    description: 'Allows a user to reset their password using a valid token.',
  })
  @ApiBearerAuth() // Requires JWT authentication
  @ApiBody({
    description: 'Data required to reset the password',
    type: ResetPasswordDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully.',
    schema: {
      example: {
        message: 'Password reset successfully.',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input data.',
    schema: {
      example: {
        statusCode: 400,
        message: ['password must be longer than or equal to 8 characters'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. The token is invalid or expired.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. Something went wrong on the server.',
  })
  async resetPassword(@Token() token: string, @Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(token, resetPasswordDto);
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
  @Post('/update-password')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.authService.updatePassword(updatePasswordDto);
  }


  @ApiOperation({
    summary: 'Create a new user with an uploaded file',
    description: 'Creates a new user based on the provided file. The file must be an image and can be up to 10 MB in size.',
  })
  @ApiBearerAuth('Authorization') // If you are using Bearer token for authentication
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, possibly due to invalid file or file size exceeding limit.',
  })
  @ApiConsumes('multipart/form-data')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Post("/create-users")
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: FILE_UPLOAD_DIR,
      filename: filenameEditor,
    }),
    limits: {
      fileSize: 1000 * 1000 * 10
    },
    fileFilter: imageFileFilter,
  }))
  async createUser(@Token() token: string, @UploadedFile() file: Express.Multer.File) {
    return this.authService.createUser(file);
  }
}
