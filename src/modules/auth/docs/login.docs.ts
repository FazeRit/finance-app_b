import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { TokensResponseDto } from '../auth-shared/dto/response/tokens-response.dto';

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
		type: TokensResponseDto,
	}),
	ApiResponse({
		status: 401,
		description: 'Unauthorized - Invalid credentials',
	}),
) 