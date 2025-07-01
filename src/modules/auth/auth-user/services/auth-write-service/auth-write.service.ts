import * as argon from 'argon2';
import { ApiException } from 'src/shared/factories/api-exception.factory';
import { Injectable } from '@nestjs/common';
import { JwtTokenService } from '../../../auth-shared/services/auth-token.service';
import { RegisterDto } from '../../dto/request/register.dto';
import { TokensResponseDto } from '../../../auth-shared/dto/response/tokens-response.dto';
import { User } from '@prisma/client';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthWriteService {
	constructor(
		private usersService: UsersService,
		private jwtToken: JwtTokenService,
	) {}

	async register(credentials: RegisterDto): Promise<TokensResponseDto> {
		const hashedPassword = await argon.hash(credentials.password);

		const createdUser = await this.usersService.createUser({
			email: credentials.email,
			hashedPassword,
		});

		const tokens = await this.jwtToken.issueTokens(createdUser.id);

		return tokens;
	}

	async validateUser(
		email: string,
		password: string
	): Promise<User> {
		const user = await this.usersService.getUser({
			email
		})
		if (!user) {
			throw ApiException.unauthorized('Credentials are invalid');
		}

		const isMatchPassword = await argon.verify(user.hashedPassword, password);
		if (!isMatchPassword) {
			throw ApiException.unauthorized('Credentials are invalid');
		}

		return user;
	}

	async validateRefreshToken(refreshToken: string): Promise<User> {
		const { userId } = await this.jwtToken.verifyRefreshToken(refreshToken);
		const user = await this.usersService.getUser({
			id: userId
		})

		return user;
	}

	async generateTokens(userId: string): Promise<TokensResponseDto> {
		const tokens = await this.jwtToken.issueTokens(userId);

		return tokens;
	}

	async externalAuth(email: string): Promise<TokensResponseDto> {
		const user = await this.usersService.getUser({
			email
		});
		if (user) {
			const tokens = await this.jwtToken.issueTokens(user.id);
			return tokens;
		}

		const createdUser = await this.usersService.createUser({ email });

		const tokens = await this.jwtToken.issueTokens(createdUser.id);

		return tokens;
	}
}
