import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { RedisModule } from 'src/redis/redis.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    RedisModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10
      }
    ])
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class CommentsModule { }
