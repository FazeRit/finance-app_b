import {
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
	ApiResponse
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { ExpenseEntity } from '../../expenses/types/expenses.types';

class DetailedExpensesResponse {
  expenses: ExpenseEntity[];
  total: number;
  month: string;
  year: number;
}

export const GetDetailedExpensesDoc = applyDecorators(
  ApiOperation({ summary: 'Get detailed expenses for a specific month' }),
  ApiBearerAuth('jwt-access'),
  ApiQuery({
    name: 'month',
    description: 'Month number (1-12)',
    example: '3',
    required: true,
  }),
  ApiQuery({
    name: 'year',
    description: 'Year in YYYY format',
    example: '2024',
    required: true,
  }),
  ApiResponse({
    status: 200,
    description: 'Detailed expenses fetched successfully',
    type: DetailedExpensesResponse,
  }),
  ApiResponse({ status: 401, description: 'Unauthorized' }),
  ApiResponse({ status: 500, description: 'Internal server error' }),
) 