import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();

    // Call the default canActivate method to validate JWT
    const canActivate = (await super.canActivate(context)) as boolean;

    // If roles are specified, perform role check
    if (roles && canActivate) {
      const user = request.user;
      if (!user || !roles.includes(user.userType)) {
        throw new UnauthorizedException('You do not have the required role');
      }
    }

    return canActivate;
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }

}
