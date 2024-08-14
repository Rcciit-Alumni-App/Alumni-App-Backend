import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../../../src/redis/redis.module';

@Module({
  imports: [
    AuthModule,
    RedisModule,
  ],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule { }
