import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiResponse
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { Category } from '@prisma/client';
import { CategoryEntity } from '../types/categories.types';
import { CreateCategoryDto } from '../dto/request/create-category.dto';

export const CreateCategoryDoc = applyDecorators(
  ApiOperation({ summary: 'Create new category for expenses' }),
  ApiBearerAuth('jwt-access'),
  ApiBody({ type: CreateCategoryDto }),
  ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: CategoryEntity,
  }),
  ApiResponse({
    status: 401,
    description: 'Unauthorized',
  }),
  ApiResponse({
    status: 409,
    description: 'Category with this name already exists',
  }),
  ApiResponse({
    status: 500,
    description: 'Internal server error',
  }),
) 