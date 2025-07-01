import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiResponse
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { ExpenseEntity } from '../types/expenses.types';

export const GetExpenseByIdDoc = applyDecorators(
  ApiOperation({ summary: 'Get an expense by ID' }),
  ApiBearerAuth('jwt-access'),
  ApiParam({ name: 'id', description: 'Expense ID', type: 'string' }),
  ApiResponse({
    status: 200,
    description: 'Expense fetched successfully',
    type: ExpenseEntity,
  }),
  ApiResponse({ status: 401, description: 'Unauthorized' }),
  ApiResponse({ status: 404, description: 'Expense not found' }),
  ApiResponse({ status: 500, description: 'Internal server error' }),
) 