import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy';
import { JwtAuthGuard } from './guards/jwt.guard';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MailerModule,
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtStrategy, JwtAuthGuard, PassportModule],
})
export class AuthModule {}
