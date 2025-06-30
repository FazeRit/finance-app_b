import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { TokenResponseDto } from '../auth-shared/dto/response/token-response.dto';

export const LoginDoc = applyDecorators(
	ApiOperation({ summary: 'Log in a user with email and password' }),
	ApiBody({
		schema: {
			type: 'object',
			properties: {
				email: { type: 'string', example: 'user@example.com' },
				password: { type: 'string', example: 'password123' },
			},
			required: ['email', 'password'],
		},
	}),
	ApiResponse({
		status: 200,
		description: 'User logged in successfully',
		type: TokenResponseDto,
	}),
	ApiResponse({
		status: 401,
		description: 'Unauthorized - Invalid credentials',
	}),
) 