import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class SignupDto {
    @IsEmail()
    @IsNotEmpty()
    personal_email: string;
    @IsEmail()
    @IsNotEmpty()
    college_email: string;

    @IsString()
    @IsNotEmpty()
    college_roll: string;
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class VerifyDto {
    @IsString()
    @IsNotEmpty()
    verification_token: string;

    @IsString()
    @IsNotEmpty()
    otp: string;
}

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    personal_email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}