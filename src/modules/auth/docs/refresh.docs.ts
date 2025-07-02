import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { TokensResponseDto } from '../auth-shared/dto/response/tokens-response.dto';

export const RefreshDoc = applyDecorators(
	ApiOperation({ summary: 'Refresh access token using refresh token' }),
	ApiCookieAuth('refreshToken'),
	ApiResponse({
		status: 200,
		description: 'Access token refreshed successfully',
		type: TokensResponseDto,
	}),
	ApiResponse({
		status: 401,
		description: 'Unauthorized - Invalid or expired refresh token',
	}),
) 