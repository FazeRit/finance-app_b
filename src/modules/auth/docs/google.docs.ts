import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export const GoogleAuthDoc = applyDecorators(
	ApiOperation({ summary: 'Initiate Google authentication' }),
	ApiResponse({
		status: 302,
		description: 'Redirects to Google login page',
		schema: { type: 'string', format: 'uri' },
	}),
)

export const GoogleCallbackDoc = applyDecorators(
	ApiOperation({ summary: 'Google authentication callback' }),
	ApiResponse({
		status: 302,
		description: 'Redirects to frontend home page after Google authentication',
		schema: { type: 'string', format: 'uri' },
	}),
	ApiResponse({
		status: 401,
		description: 'Unauthorized - Google authentication failed',
	}),
) 