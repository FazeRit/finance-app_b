import {
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
	ApiResponse
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

class YearStatisticsResponse {
  totalExpenses: number;
  monthlyBreakdown: Array<{
    month: string;
    totalAmount: number;
  }>;
  categoryBreakdown: Array<{
    categoryId: string;
    categoryName: string;
    totalAmount: number;
    percentage: number;
  }>;
  year: number;
}

export const GetYearStatisticsDoc = applyDecorators(
  ApiOperation({
    summary: 'Get expense statistics for a specific year',
    description: 'Returns total expenses, monthly breakdown, and category breakdown for the year',
  }),
  ApiBearerAuth('jwt-access'),
  ApiQuery({
    name: 'year',
    description: 'Year in YYYY format',
    example: '2024',
    required: false,
  }),
  ApiResponse({
    status: 200,
    description: 'Year statistics fetched successfully',
    type: YearStatisticsResponse,
  }),
  ApiResponse({ status: 401, description: 'Unauthorized' }),
  ApiResponse({ status: 500, description: 'Internal server error' }),
) 