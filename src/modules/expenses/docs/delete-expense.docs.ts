import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiResponse
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

class DeleteExpenseResponse {
  message: string;
}

export const DeleteExpenseDoc = applyDecorators(
  ApiOperation({ summary: 'Delete an expense' }),
  ApiBearerAuth('jwt-access'),
  ApiParam({ name: 'id', description: 'Expense ID', type: 'string' }),
  ApiResponse({
    status: 200,
    description: 'Expense deleted successfully',
    type: DeleteExpenseResponse,
  }),
  ApiResponse({ status: 401, description: 'Unauthorized' }),
  ApiResponse({ status: 404, description: 'Expense not found' }),
  ApiResponse({ status: 500, description: 'Internal server error' }),
) 