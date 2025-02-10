import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.strategy';
import { ConfigModule } from '@nestjs/config';
import { JwtAccessStrategy } from './strategy/jwt-access.strategy';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [UsersModule, JwtModule.register({}), ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtAccessStrategy, GoogleStrategy],
})
export class AuthModule {}
