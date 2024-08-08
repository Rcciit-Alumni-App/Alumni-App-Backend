import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  
  @Injectable()
  export class ApiJwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext): boolean {
      return super.canActivate(context) as boolean;
    }
  
    handleRequest(err: any, user: any) {
      if (err || !user) {
        throw err || new UnauthorizedException('Invalid or expired token');
      }
      return user;
    }
  }
  