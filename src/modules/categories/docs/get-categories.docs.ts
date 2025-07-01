import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { CategoryEntity } from '../types/categories.types';

export const GetCategoriesDoc = applyDecorators(
  ApiOperation({ summary: 'Get all categories for expenses' }),
  ApiBearerAuth('jwt-access'),
  ApiResponse({
    status: 200,
    description: 'Categories fetched successfully',
    type: [CategoryEntity],
  }),
  ApiResponse({
    status: 401,
    description: 'Unauthorized',
  }),
  ApiResponse({
    status: 500,
    description: 'Internal server error',
  }),
) 