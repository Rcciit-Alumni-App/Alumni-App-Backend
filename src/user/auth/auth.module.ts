import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../../src/prisma/prisma.module';
import { MailerModule } from '../../../src/mailer/mailer.module';
import { RedisModule } from '../../../src/redis/redis.module';

@Global()
@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MailerModule,
    RedisModule,
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtStrategy, JwtAuthGuard, PassportModule],
})
export class AuthModule {}
