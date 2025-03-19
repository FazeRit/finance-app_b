import { ConsoleLogger, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  InvalidCredentialsException,
  TokensCreatiomFailedException,
} from 'src/utils/exceptions';

@Injectable()
export class AuthService {
  private logger = new ConsoleLogger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(credentials: RegisterDto) {
    try {
      const hashedPassword = await argon.hash(credentials.password);
      const createdUser = await this.usersService.createUser({
        email: credentials.email,
        hashedPassword,
      });
      return await this.generateTokens(createdUser.id);
    } catch (error) {
      this.logger.error(
        `Failed to register user ${credentials.email}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUser({ email });
    if (!user) {
      this.logger.warn(`User not found for email ${email}`);
      throw new InvalidCredentialsException();
    }

    try {
      const isMatchPassword = await argon.verify(user.hashedPassword, password);
      if (!isMatchPassword) {
        this.logger.warn(`Invalid password for user ${email}`);
        throw new InvalidCredentialsException();
      }
      return user;
    } catch (error) {
      this.logger.error(
        `Failed to validate user ${email}: ${error.message}`,
        error.stack,
      );
      throw new InvalidCredentialsException();
    }
  }

  async generateTokens(userId: number) {
    try {
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

      if (!refreshToken || !accessToken) {
        this.logger.error(`Failed to generate tokens for user ${userId}`);
        throw new TokensCreatiomFailedException();
      }

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error(
        `Token generation failed for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw error instanceof TokensCreatiomFailedException
        ? error
        : new TokensCreatiomFailedException();
    }
  }

  async externalAuth(email: string) {
    try {
      const user = await this.usersService.getUser({ email });
      if (user) {
        return await this.generateTokens(user.id);
      }

      const createdUser = await this.usersService.createUser({ email });
      return await this.generateTokens(createdUser.id);
    } catch (error) {
      this.logger.error(
        `External auth failed for email ${email}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
