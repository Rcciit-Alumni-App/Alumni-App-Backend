// src/common/decorators/token.decorator.ts

import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { getToken } from 'utils/auth/getToken';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = getToken(request);

    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    return token;
  },
);
