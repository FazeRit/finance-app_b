import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { LogoutResponseDto } from '../auth-shared/dto/response/logout-response.dto';

export const LogoutDoc = applyDecorators(
	ApiOperation({ summary: 'Log out a user' }),
	ApiBearerAuth('JWT-access'),
	ApiResponse({
		status: 200,
		description: 'User logged out successfully',
		type: LogoutResponseDto,
	}),
	ApiResponse({
		status: 401,
		description: 'Unauthorized - Invalid or expired access token',
	}),
) 