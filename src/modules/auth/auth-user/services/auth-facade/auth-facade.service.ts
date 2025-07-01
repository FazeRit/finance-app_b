import { ApiResponse } from 'src/shared/types/api-response.types';
import { ApiResponseFactory } from 'src/shared/factories/api-response.factory';
import { AuthWriteService } from '../auth-write-service/auth-write.service';
import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../../dto/request/register.dto';
import { TokensResponseDto } from '../../../auth-shared/dto/response/tokens-response.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthFacadeService {
	constructor(
		private authWriteService: AuthWriteService,
	) {}

	public async register(credentials: RegisterDto): Promise<ApiResponse<TokensResponseDto>> {
		const tokens = await this.authWriteService.register(credentials);
		return ApiResponseFactory.createResponse({
			data: tokens,
		});
	}

	public async validateUser(email: string, password: string): Promise<ApiResponse<User>> {
		const user = await this.authWriteService.validateUser(email, password);

		return ApiResponseFactory.createResponse({
			data: user,
		});
	}

	public async validateRefreshToken(refreshToken: string): Promise<ApiResponse<{ userId: string }>> {
		const user = await this.authWriteService.validateRefreshToken(refreshToken);
		return ApiResponseFactory.createResponse({
			data: { userId: user.id },
		});
	}

	public async generateTokens(userId: string): Promise<ApiResponse<TokensResponseDto>> {
		const tokens = await this.authWriteService.generateTokens(userId);
		return ApiResponseFactory.createResponse({
			data: tokens,
		});
	}

	public async externalAuth(email: string): Promise<ApiResponse<TokensResponseDto>> {
		const tokens = await this.authWriteService.externalAuth(email);
		return ApiResponseFactory.createResponse({
			data: tokens,
		});
	}
}

