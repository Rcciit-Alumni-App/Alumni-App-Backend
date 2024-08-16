import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { JobService } from './jobs.service';
import { JobController } from './jobs.controller';
import { AuthModule } from 'src/user/auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { JwtStrategy } from 'src/user/auth/strategy';
import { JwtAuthGuard } from 'src/user/auth/guards/jwt.guard';

@Module({
  imports: [
    AuthModule,
    RedisModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10
      }
    ])
  ],
  controllers: [JobController],
  providers: [
    JobService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }, 
    JwtStrategy, 
    JwtAuthGuard,
  ],
  exports: [JwtStrategy, JwtAuthGuard],
})
export class JobModule {}
