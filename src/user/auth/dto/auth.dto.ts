import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class SignupDto {
    @ApiProperty({
        description: 'Personal email of the user',
        type: String,
        example: 'john.doe@example.com',
      })
    @IsEmail()
    @IsNotEmpty()
    personal_email: string;

    @ApiProperty({
        description: 'College email of the user',
        type: String,
        example: 'johndoe@college.edu',
      })
    @IsEmail()
    @IsNotEmpty()
    college_email: string;

    @ApiProperty({
        description: 'College roll number of the user',
        type: String,
        example: 'COL123456',
      })
    @IsString()
    @IsNotEmpty()
    college_roll: string;

    @ApiProperty({
        description: 'Password for the user account',
        type: String,
        example: 'password123',
      })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}

export class VerifyDto {
    @ApiProperty({
        description: 'Verification token for the user',
        type: String,
        example: '<jwt-token>',
      })
    @IsString()
    @IsNotEmpty()
    verification_token: string;

    @ApiProperty({
        description: 'One-time password (OTP) for verification',
        type: String,
        example: '123456',
      })
    @IsString()
    @IsNotEmpty()
    otp: string;
}

export class LoginDto {
    @ApiProperty({
        description: 'Personal email of the user for login',
        type: String,
        example: 'john.doe@example.com',
      })
    @IsEmail()
    @IsNotEmpty()
    personal_mail: string;

    @ApiProperty({
        description: 'Password for the user account',
        type: String,
        example: 'password123',
      })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}

export class ResetPasswordDto {

    @ApiProperty({
        description: 'One-time password (OTP) for resetting password',
        type: String,
        example: '123456',
      })
    @IsString()
    @IsNotEmpty()
    otp: string;

    @ApiProperty({
        description: 'New password for the user account',
        type: String,
        example: 'newpassword123',
      })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({
        description: 'Verification token for password reset',
        type: String,
        example: '<jwt-token>',
      })
    @IsString()
    @IsNotEmpty()
    verification_token: string;

}