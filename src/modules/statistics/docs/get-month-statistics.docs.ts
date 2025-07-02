import {
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
	ApiResponse
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

class MonthStatisticsResponse {
  totalExpenses: number;
  categoryBreakdown: Array<{
    categoryId: string;
    categoryName: string;
    totalAmount: number;
    percentage: number;
  }>;
  currentMonth: string;
  previousMonth: {
    totalExpenses: number;
    percentageChange: number;
  };
}

export const GetMonthStatisticsDoc = applyDecorators(
  ApiOperation({
    summary: 'Get expense statistics for a specific month',
    description: 'Returns total expenses, category breakdown, and comparison with previous month',
  }),
  ApiBearerAuth('jwt-access'),
  ApiQuery({
    name: 'month',
    description: 'Month in YYYY-MM format',
    example: '2024-03',
    required: false,
  }),
  ApiQuery({
    name: 'year',
    description: 'Year in YYYY format',
    example: '2024',
    required: false,
  }),
  ApiResponse({
    status: 200,
    description: 'Statistics fetched successfully',
    type: MonthStatisticsResponse,
  }),
  ApiResponse({ status: 401, description: 'Unauthorized' }),
  ApiResponse({ status: 500, description: 'Internal server error' }),
) 