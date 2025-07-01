import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { ExpenseEntity } from '../types/expenses.types';

export const GetExpensesDoc = applyDecorators(
  ApiOperation({ summary: 'Get all expenses for the authenticated user' }),
  ApiBearerAuth('jwt-access'),
  ApiResponse({
    status: 200,
    description: 'Expenses fetched successfully',
    type: [ExpenseEntity],
  }),
  ApiResponse({ status: 401, description: 'Unauthorized' }),
  ApiResponse({ status: 500, description: 'Internal server error' }),
) 