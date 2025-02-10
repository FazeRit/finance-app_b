import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InvalidCredentialsException } from 'src/utils/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(credentials: RegisterDto) {
    const hashedPassword = await argon.hash(credentials.password);

    const createdUser = await this.usersService.createUser({
      email: credentials.email,
      hashedPassword,
    });

    return this.generateTokens(createdUser.id);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUser({ email });

    const isMatchPassword = await argon.verify(user.hashedPassword, password);
    if (!isMatchPassword) throw new InvalidCredentialsException();

    return user;
  }

  async generateTokens(userId: number) {
    const accessToken = await this.jwtService.signAsync(
      { userId },
      {
        secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: this.config.getOrThrow('JWT_ACCESS_EXPIRATION'),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { userId },
      {
        secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: this.config.getOrThrow('JWT_REFRESH_EXPIRATION'),
      },
    );

    if (!refreshToken || !accessToken) return { accessToken, refreshToken };
  }

  async googleAuth(email: string) {
    const user = await this.usersService.getUser({ email });
    if (user) {
      return await this.generateTokens(user.id);
    }

    const createdUser = await this.usersService.createUser({ email });

    return await this.generateTokens(createdUser.id);
  }
}
