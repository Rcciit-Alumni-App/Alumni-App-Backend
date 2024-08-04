// src/common/utils/token.util.ts

import { Request } from 'express';

export function getToken(req: Request): string | undefined {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1]; 
  }
  return undefined;
}
