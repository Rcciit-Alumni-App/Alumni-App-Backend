import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { ApiJwtStrategy } from 'src/user/auth/strategy';

@Module({
  imports: [ApiJwtStrategy],
  providers: [ApiService],
  controllers: [ApiController],
  exports: [ApiJwtStrategy]
})
export class ApiModule { }
