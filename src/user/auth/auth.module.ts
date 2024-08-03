import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}),
    MailerModule
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }
