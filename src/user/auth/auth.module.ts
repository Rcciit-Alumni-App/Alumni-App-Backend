import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../../src/prisma/prisma.module';
import { MailerModule } from '../../../src/mailer/mailer.module';
import { RedisModule } from '../../../src/redis/redis.module';
import { JwtAuthGuard } from './guards';
import { MulterModule } from '@nestjs/platform-express';
import { FILE_UPLOAD_DIR } from 'utils/constants';

@Global()
@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MailerModule,
    RedisModule,
    MulterModule.register({
      dest: FILE_UPLOAD_DIR,
      limits: {
        fileSize: 1000 * 1000 * 10,
      }
    })
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtStrategy, JwtAuthGuard, PassportModule],
})
export class AuthModule { }
