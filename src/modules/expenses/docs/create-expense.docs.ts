import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiResponse
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { ExpenseEntity } from '../types/expenses.types';

export const CreateExpenseDoc = applyDecorators(
  ApiOperation({ summary: 'Create a new expense' }),
  ApiBearerAuth('jwt-access'),
  ApiBody({ type: CreateExpenseDto }),
  ApiResponse({
    status: 201,
    description: 'Expense created successfully',
    type: ExpenseEntity,
  }),
  ApiResponse({ status: 401, description: 'Unauthorized' }),
  ApiResponse({ status: 500, description: 'Internal server error' }),
) 