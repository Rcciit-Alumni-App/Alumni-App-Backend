import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { AuthModule } from 'src/user/auth/auth.module';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';

@Module({
  imports: [AuthModule,RedisModule],
  providers: [NewsService],
  controllers: [NewsController],
})
export class JobModule {}
