import { EENV_CONFIG } from 'src/modules/env/enums/env-config.enum';
import { EnvGetService } from 'src/modules/env/service/env-get.service';
import { EnvModule } from 'src/modules/env/env.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtTokenService } from '../services/auth-token.service';
import { Module } from '@nestjs/common';

@Module({
	imports: [
		EnvModule,
		JwtModule.registerAsync({
			imports: [EnvModule],
			useFactory: async (env: EnvGetService) => ({
				secret: env.get(EENV_CONFIG.JWT_ACCESS_SECRET),
				signOptions: {
					expiresIn: env.get(EENV_CONFIG.JWT_ACCESS_EXPIRATION)
				},
			}),
			inject: [EnvGetService],
		}),
	],
	providers: [JwtService, JwtTokenService],
	exports: [JwtModule, JwtService, JwtTokenService],
})
export class JwtTokenModule {}