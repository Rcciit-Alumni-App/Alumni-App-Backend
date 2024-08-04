import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({
        message: 'Unauthorized',
        error: 'Basic authentication required',
      });
    }

    const [scheme, credentials] = authHeader.split(' ');
    if (scheme !== 'Basic') {
      return res.status(401).json({
        message: 'Unauthorized',
        error: 'Invalid authentication scheme',
      });
    }

    const [username, password] = Buffer.from(credentials, 'base64').toString().split(':');
    if (username === 'admin' && password === 'password') { // Replace 'admin' and 'password' with your desired credentials
      return next();
    }

    res.status(401).json({
      message: 'Unauthorized',
      error: 'Invalid credentials',
    });
  }
}
