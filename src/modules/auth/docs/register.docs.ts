import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { RegisterDto } from '../auth-user/dto/request/register.dto';
import { TokensResponseDto } from '../auth-shared/dto/response/tokens-response.dto';

export const RegisterDoc = applyDecorators(
	ApiOperation({ summary: 'Register a new user' }),
	ApiBody({ type: RegisterDto, description: 'User registration credentials' }),
	ApiResponse({
		status: 201,
		description: 'User registered successfully',
		type: TokensResponseDto,
	}),
	ApiResponse({
		status: 400,
		description: 'Bad request - Invalid input data',
	}),
	ApiResponse({
		status: 409,
		description: 'Conflict - User already exists',
	}),
) 