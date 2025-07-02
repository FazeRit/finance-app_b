import { ApiException } from 'src/shared/factories/api-exception.factory';
import { EENV_CONFIG } from 'src/modules/env/enums/env-config.enum';
import { EnvGetService } from 'src/modules/env/service/env-get.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TJwtPayload } from '../types/auth-token.types';
import { TokensResponseDto } from '../dto/response/tokens-response.dto';

@Injectable()
export class JwtTokenService {
	private accessSecret: string

	private accessTokenExpiration: string

	private refreshSecret: string

	private refreshTokenExpiration: string

	constructor(
		private readonly env: EnvGetService,
		private readonly jwt: JwtService,
	) {
		this.accessSecret = env.get(EENV_CONFIG.JWT_ACCESS_SECRET)
		this.accessTokenExpiration = env.get(EENV_CONFIG.JWT_ACCESS_EXPIRATION)
		this.refreshSecret = env.get(EENV_CONFIG.JWT_REFRESH_SECRET)
	}

	public async verifyRefreshToken(refreshToken: string): Promise<TJwtPayload> {
		const payload = await this.jwt.verifyAsync(refreshToken, {
			secret: this.refreshSecret,
		})

		if(!payload.userId) {
			throw ApiException.unauthorized(
				'Invalid refresh token payload'
			)
		}

		return payload
	}

	private async issueAccessToken(userId: string): Promise<string> {
		const accessToken = await this.jwt.signAsync({
			userId
		},
			{
				secret: this.accessSecret,
				expiresIn: this.accessTokenExpiration,
			},
		)

		if(!accessToken) {
			throw ApiException.unauthorized(
				'Invalid access token creation'
			)
		}

		return accessToken
	}

	private async issueRefreshToken(userId: string): Promise<string> {
		const refreshToken = await this.jwt.signAsync({
			userId
		},
			{
				secret: this.refreshSecret,
				expiresIn: this.refreshTokenExpiration,
			}
		)

		if(!refreshToken) {
			throw ApiException.unauthorized(
				'Invalid refresh token creation'
			)
		}

		return refreshToken
	}

	public async issueTokens(userId: string): Promise<TokensResponseDto> {
		const accessToken = await this.issueAccessToken(userId)
		const refreshToken = await this.issueRefreshToken(userId)

		return {
			accessToken,
			refreshToken
		}
	}
}