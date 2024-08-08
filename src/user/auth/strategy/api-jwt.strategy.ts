import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class ApiJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request.headers['x-alumni-app-host'] as string;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('JWT_AUTHENTICATION_SECRET'),
        });
    }

    validate(payload: any) {
        return payload;
    }
}
