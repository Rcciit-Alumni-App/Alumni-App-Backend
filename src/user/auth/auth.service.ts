import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, SignupDto, VerifyDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserStatus, UserType } from '@prisma/client';
import { verifyAlumniStudent } from 'utils/auth/verify_alumni_student';
import { generateOTP } from 'utils/auth/generate_otp';
import { MailerService } from 'src/mailer/mailer.service';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mailer: MailerService,
  ) {}
  async signup(signupDto: SignupDto) {
    console.log(signupDto);

    // Get emails, password
    const { college_email, college_roll, password, personal_email } = signupDto;

    // Check with database if any user exists or not
    const existsUser = await this.prisma.user.findFirst({
      where: {
        college_mail: college_email,
        college_roll,
        personal_mail: personal_email,
      },
    });

    if (existsUser) throw new UnauthorizedException('User already exists');
    // generate the end year and detect the user type

    const userType: {
      user_type: UserType;
      stream: string;
    } = verifyAlumniStudent(college_email);

    // Generate otp

    const otp = generateOTP(6);

    // Hash password

    const hashedPassword = await argon.hash(password);

    // sign verification token
    const payload = {
      college_email,
      personal_email,
      college_roll,
      password: hashedPassword,
      otp,
      user_type: userType.user_type,
      stream: userType.stream,
    };

    console.log(payload);
    const verificationToken = this.jwt.sign(payload, {
      expiresIn: '5m',
      secret: this.config.get('JWT_VERIFICATION_SECRET'),
    });

    // Send email

    const mailData = {
      otp: otp,
    };

    await this.mailer.sendMail({
      email: userType.user_type === 'ALUMNI' ? personal_email : college_email,
      subject: 'Account Activation',
      mail_file: 'verification_mail.ejs',
      data: mailData,
    });

    return {
      verificationToken,
    };
  }

  async verify(verifyDto: VerifyDto) {
    const { otp, verification_token } = verifyDto;
    // Get token and otp
    const decoded = this.jwt.verify(verification_token, {
      secret: this.config.get('JWT_VERIFICATION_SECRET'),
    });

    console.log(decoded);

    // Decode the token and check with otp
    if (decoded.otp !== otp) throw new UnauthorizedException('Wrong OTP');
    // Save the user to database

    const user = await this.prisma.user.create({
      data: {
        full_name: '',
        phone: '',
        college_mail: decoded.college_email,
        personal_mail: decoded.personal_email,
        college_roll: decoded.college_roll,
        password: decoded.password,
        stream: decoded.stream,
        status: UserStatus.ACCOUNT_DETAILS,
        user_type: decoded.user_type,
        profile_pic_url: '',
        university_roll: '',
      },
    });

    // Sign access_token and return

    const access_token = await this.signAccessToken(
      user.id,
      user.personal_mail,
      user.user_type,
    );
    console.log(access_token);
    // TODO:Save to redis

    return {
      access_token,
    };
  }

  async login(loginDto: LoginDto) {
    console.log(loginDto);
    // Get email and password
    const { personal_email, password } = loginDto;

    // Check with database
    const user = await this.prisma.user.findFirst({
      where: {
        personal_mail: personal_email,
      },
    });

    if (!user) throw new UnauthorizedException('User does not exist !');

    const verified = await argon.verify(user.password, password);
    console.log(verified);
    if (!verified) throw new UnauthorizedException('Invalid Password !');

    // Sign access_token and return
    const access_token = await this.signAccessToken(
      user.id,
      user.personal_mail,
      user.user_type,
    );
    console.log(access_token);
    // TODO:Save to redis

    return {
      access_token,
    };
  }

  logout() {
    // TODO: To be implemented
  }

  signAccessToken(
    userId: string,
    email: string,
    userType: UserType,
  ): Promise<string> {
    const payload = {
      sub: userId,
      email,
      userType,
    };

    return this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: this.config.get('JWT_AUTHENTICATION_SECRET'),
    });
  }
}
