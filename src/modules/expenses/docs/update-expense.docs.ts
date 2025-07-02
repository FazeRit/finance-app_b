import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { ExpenseEntity } from '../types/expenses.types';
import { UpdateExpenseDto } from '../dto/update-expense.dto';

export const UpdateExpenseDoc = applyDecorators(
  ApiOperation({ summary: 'Update an expense by ID' }),
  ApiBearerAuth('jwt-access'),
  ApiParam({ name: 'id', description: 'Expense ID', type: 'string' }),
  ApiBody({ type: UpdateExpenseDto }),
  ApiResponse({
    status: 200,
    description: 'Expense updated successfully',
    type: ExpenseEntity,
  }),
  ApiResponse({ status: 400, description: 'Invalid input' }),
  ApiResponse({ status: 401, description: 'Unauthorized' }),
  ApiResponse({ status: 404, description: 'Expense not found' }),
  ApiResponse({ status: 500, description: 'Internal server error' }),
)