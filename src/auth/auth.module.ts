import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.strategy';
import { ConfigModule } from '@nestjs/config';
import { JwtAccessStrategy } from './strategy/jwt-access.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { TwitterStrategy } from './strategy/twitter.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}),
    PassportModule.register({ session: true }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessStrategy,
    GoogleStrategy,
    TwitterStrategy,
  ],
})
export class AuthModule {}
