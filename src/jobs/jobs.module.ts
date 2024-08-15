import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { JobService } from './jobs.service';
import { JobController } from './jobs.controller';
import { AuthModule } from 'src/user/auth/auth.module';
import { JwtStrategy } from 'src/user/auth/strategy';
import { JwtAuthGuard } from 'src/user/auth/guards/jwt.guard';

@Module({
  imports: [AuthModule,RedisModule],
  providers: [JobService, JwtStrategy, JwtAuthGuard],
  controllers: [JobController],
  exports: [JwtStrategy, JwtAuthGuard],
})
export class JobModule {}
