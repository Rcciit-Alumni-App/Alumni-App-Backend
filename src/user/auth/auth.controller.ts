import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto, VerifyDto } from './dto';
import { verifyRollNo } from 'utils/auth/verify_roll_no';

@Controller('user/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("/signup")
    async register(@Body() signupDto: SignupDto) {
        if (verifyRollNo(signupDto.college_roll, signupDto.college_email))
            return await this.authService.signup(signupDto);
        else
            throw new Error("Invalid information....Please check credentials");
    }

    @Post("/verify")
    async verify(@Body() verifyDto: VerifyDto) {
        return await this.authService.verify(verifyDto);
    }

    @Post('/login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
