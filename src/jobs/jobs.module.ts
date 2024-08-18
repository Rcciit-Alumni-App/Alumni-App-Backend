import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { JobService } from './jobs.service';
import { JobController } from './jobs.controller';
import { AuthModule } from 'src/user/auth/auth.module';

@Module({
  imports: [AuthModule,RedisModule],
  providers: [JobService],
  controllers: [JobController],
})
export class JobModule {}
