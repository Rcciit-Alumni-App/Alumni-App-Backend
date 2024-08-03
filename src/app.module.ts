import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_AUTHENTICATION_SECRET'),
        signOptions: { expiresIn: '60m' }, 
      }),
      inject: [ConfigService],
      global: true, 
    }),
    UserModule,
    PrismaModule,
    MailerModule,
  ],
})
export class AppModule { }
