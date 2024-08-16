import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { JobService } from './jobs.service';
import { JobController } from './jobs.controller';
import { AuthModule } from 'src/user/auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

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
    }
  ],
})
export class JobModule {}
