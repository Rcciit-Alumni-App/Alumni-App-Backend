import * as argon from 'argon2';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserStatus, UserType } from '@prisma/client';
import { LoginDto, ResetPasswordDto, SignupDto, UpdatePasswordDto, VerifyDto } from './dto';
import { verifyAlumniStudent } from '../../../utils/auth/verify_alumni_student';
import { generateOTP } from '../../../utils/auth/generate_otp';
import { decodeToken } from '../../../utils/auth/decodeToken';
import { MailerService } from '../../../src/mailer/mailer.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { RedisService } from '../../../src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mailer: MailerService,
    private readonly redis: RedisService,
  ) { }
  async signup(signupDto: SignupDto) {
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
  
    // Decode the token and check with otp
    if (decoded.otp !== otp) throw new UnauthorizedException('Wrong OTP');
  
    // Check if the personal email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: {
        personal_mail: decoded.personal_email,
      },
    });
  
    if (existingUser) throw new UnauthorizedException('User already exists with this personal email');
  
    // Save the user to database
    const user = await this.prisma.user.create({
      data: {
        full_name: '',
        phone: '',
        college_mail: decoded.college_email,
        personal_mail: decoded.personal_email,
        college_roll: decoded.college_roll,
        domain: '',
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
      false
    );
  
    delete user.password;
    // Save to redis
    this.redis.setCache(user.id, user);
  
    return {
      access_token,
    };
  }

  async resendOTP(token: string) {
      const decoded = this.jwt.verify(token, {
        secret: this.config.get('JWT_VERIFICATION_SECRET'),
      });

      const otp = generateOTP(6);

      const payload = { ...decoded, otp: otp };

      const verificationToken = this.jwt.sign(payload, {
        expiresIn: '5m',
        secret: this.config.get('JWT_VERIFICATION_SECRET'),
      });

      // Send email

      const mailData = {
        otp: otp,
      };

      await this.mailer.sendMail({
        email: decoded.userType.user_type === 'ALUMNI' ? decoded.personal_email : decoded.college_email,
        subject: 'Account Activation',
        mail_file: 'verification_mail.ejs',
        data: mailData,
      });

      return {
        verificationToken,
      };
  }

  async login(loginDto: LoginDto) {
      const { personal_mail, password } = loginDto;
      const user = await this.prisma.user.findFirst({
        where: {
          personal_mail: personal_mail,
        },
      });

      if (!user) throw new UnauthorizedException('User does not exist !');

      const verified = await argon.verify(user.password, password);
      if (!verified) throw new UnauthorizedException('Invalid Password !');
      const access_token = await this.signAccessToken(
        user.id,
        user.personal_mail,
        user.user_type,
        false
      );

      delete user.password;
      // Save to redis
      this.redis.setCache(user.id, user);

      return {
        access_token,
      };
  }

  logout(token: string) {
    const userId = decodeToken(token, this.jwt, this.config);
    this.redis.deleteCache(userId);
  }

  async forgotPassword(email: string) {
      const existsUser = await this.prisma.user.findUnique({
        where: {
          personal_mail: email,
        },
      });

      if (!existsUser) throw new UnauthorizedException('User does not exist');
      const otp = generateOTP(6);
      // sign verification token
      const payload = {
        user_id: existsUser.id,
        personal_mail: email,
        otp,
        flag: 'F' // F -> forgot password, R -> reset password
      };

      const verificationToken = this.jwt.sign(payload, {
        expiresIn: '5m',
        secret: this.config.get('JWT_VERIFICATION_SECRET'),
      });

      // Send email

      const mailData = {
        otp: otp,
      };

      await this.mailer.sendMail({
        email: email,
        subject: 'Forgot Password',
        mail_file: 'update_password_mail.ejs',
        data: mailData,
      });

      return {
        verificationToken,
      };
  }

  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto) {

      const { password, new_password } = resetPasswordDto;

      if (password === new_password) throw new UnauthorizedException("Password need to be different");

      const userId = decodeToken(token, this.jwt, this.config);
      const existsUser = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!existsUser) throw new UnauthorizedException('User does not exist');

      const verified = await argon.verify(existsUser.password, password);
      if (!verified) throw new UnauthorizedException('Invalid Password !');

      const otp = generateOTP(6);


      const hashedPassword = await argon.hash(new_password);

      // sign verification token
      const payload = {
        user_id: existsUser.id,
        personal_mail: existsUser.personal_mail,
        otp,
        password: hashedPassword,
        flag: 'R' // F -> forgot password, R -> reset password
      };

      const verificationToken = this.jwt.sign(payload, {
        expiresIn: '5m',
        secret: this.config.get('JWT_VERIFICATION_SECRET'),
      });

      // Send email

      const mailData = {
        otp: otp,
      };

      await this.mailer.sendMail({
        email: existsUser.personal_mail,
        subject: 'Forgot Password',
        mail_file: 'update_password_mail.ejs',
        data: mailData,
      });

      return {
        verificationToken,
      };
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const { otp, password, verification_token } = updatePasswordDto;
    const decoded = this.jwt.verify(verification_token, {
      secret: this.config.get('JWT_VERIFICATION_SECRET'),
    });

    if (decoded.otp !== otp) throw new UnauthorizedException('Wrong OTP');

    const flag = decoded.flag;
    let user: User;
    if (flag === 'R') {
      user = await this.prisma.user.update({
        where: {
          id: decoded.user_id,
          personal_mail: decoded.email,
        },
        data: {
          password: decoded.password
        }
      });
    }
    else {
      user = await this.prisma.user.update({
        where: {
          id: decoded.user_id,
          personal_mail: decoded.email,
        },
        data: {
          password: await argon.hash(password),
        },
      });

    }
    const access_token = await this.signAccessToken(
      user.id,
      user.personal_mail,
      user.user_type,
      false
    );
    return {
      access_token,
    };
  }

  signAccessToken(
    userId: string,
    email: string,
    userType: UserType,
    willExpire: boolean,
  ): Promise<string> {
    const payload = {
      sub: userId,
      email,
      userType,
    };

    if (willExpire)
      return this.jwt.signAsync(payload, {
        expiresIn: '7d',
        secret: this.config.get('JWT_AUTHENTICATION_SECRET'),
      });
    else
      return this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_AUTHENTICATION_SECRET'),
      });

  }
}
