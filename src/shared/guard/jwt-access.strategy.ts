import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  sub: string | number;
  email?: string;
  role?: string;
}

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_ACCESS_TOKEN');
    if (!secret) {
      throw new Error('JWT_ACCESS_TOKEN is not defined in configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: JwtPayload) {
    const { sub, email, role } = payload;
    return { userId: sub, email, role };
  }
}
