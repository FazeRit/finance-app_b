import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/utils/types';
import { UsersService } from 'src/users/users.service';
import { UserNotFoundException } from 'src/utils/exceptions';

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
      jwtFromRequest: (req: Request) => {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
          throw new UnauthorizedException('Authorization header missing');
        }

        const [, token] = authHeader.split(' ');
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('JWT_ACCESS_SECRET'),
    });
  }

  async validate({ userId }: JwtPayload) {
    const user = await this.usersService.getUser({ id: userId });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }
}
