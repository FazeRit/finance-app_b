import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { ApiException } from 'src/shared/factories/api-exception.factory';
import { AUTH_MESSAGES } from '../messages/auth.messages';
import { TJwtPayload } from '../../auth-shared/types/auth-token.types';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('JWT_ACCESS_SECRET'),
    });
  }

  async validate({ userId }: TJwtPayload) {
    const user = await this.usersService.getUser({
		id: userId
	});
    if (!user) {
      throw ApiException.unauthorized(AUTH_MESSAGES.NOT_FOUND);
    }
    return user;
  }
}
