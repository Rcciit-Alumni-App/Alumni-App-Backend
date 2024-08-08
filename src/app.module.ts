import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailerModule } from './mailer/mailer.module';
import { RedisModule } from './redis/redis.module';

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
    RedisModule,
  ],
})
export class AppModule { }
