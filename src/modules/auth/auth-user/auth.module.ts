import { AuthFacadeService } from './services/auth-facade/auth-facade.service';
import { AuthWriteController } from './controllers/auth-write-controller/auth-write.controller';
import { AuthWriteService } from './services/auth-write-service/auth-write.service';
import { EnvModule } from 'src/modules/env/env.module';
import { GoogleStrategy } from './strategy/google.strategy';
import { JwtAccessStrategy } from './strategy/jwt-access.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtTokenModule } from '../auth-shared/modules/jwt-token.module';

@Module({
	imports: [
		JwtTokenModule,
		UsersModule,
		PassportModule.register({ session: true }),
		EnvModule,
	],
	controllers: [AuthWriteController],
	providers: [
		AuthWriteService,
		AuthFacadeService,
		LocalStrategy,
		JwtAccessStrategy,
		GoogleStrategy,
	],
})
export class AuthModule {}
