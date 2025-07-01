import {
  Controller,
  Get,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/shared/decorators/get-user.decorator';
import { StatisticsService } from './statistics.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('statistics')
@UseGuards(AuthGuard('jwt-access'))
@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @ApiOperation({
    summary: 'Get total expenses by category for a specific month',
  })
  @ApiQuery({
    name: 'year',
    type: Number,
    description: 'The year to filter expenses (e.g., 2025)',
    required: true,
  })
  @ApiQuery({
    name: 'month',
    type: Number,
    description: 'The month to filter expenses (1-12)',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Total expenses grouped by category',
    schema: {
      example: {
        dataPoints: [
          { y: 5000, label: 'Food' },
          { y: 2000, label: 'Transport' },
          { y: 1860, label: 'Uncategorized' },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth('jwt-access')
  @Get('category-expenses-by-month')
  async getCategoryExpenses(
    @CurrentUser('id',) userId: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return await this.statisticsService.getCategoryExpenses(
      userId,
      year,
      month,
    );
  }

  @ApiOperation({
    summary: 'Get detailed expenses by category for a specific year',
  })
  @ApiQuery({
    name: 'year',
    type: Number,
    description: 'The year to filter expenses (e.g., 2025)',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Detailed list of expenses grouped by category for the year',
    schema: {
      example: {
        dataPoints: [
          { y: 3000, label: 'Housing - Rent' },
          { y: 5000, label: 'Food - Groceries' },
          { y: 2000, label: 'Transport - Bus Pass' },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth('jwt-access')
  @Get('total-expenses-by-year')
  async getTotalExpensesByYear(
    @CurrentUser('id') userId: string,
    @Query('year', ParseIntPipe) year: number,
  ) {
    return await this.statisticsService.getTotalExpensesByYear(userId, year);
  }

  @ApiOperation({ summary: 'Get detailed expenses for a specific month' })
  @ApiQuery({
    name: 'year',
    type: Number,
    description: 'The year to filter expenses (e.g., 2025)',
    required: true,
  })
  @ApiQuery({
    name: 'month',
    type: Number,
    description: 'The month to filter expenses (1-12)',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Detailed list of expenses for the specified month',
    schema: {
      example: {
        dataPoints: [
          { y: 5000, label: 'Groceries' },
          { y: 2000, label: 'Transport' },
          { y: 1860, label: 'Dinner' },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth('jwt-access')
  @Get('total-expenses-by-month')
  async getTotalExpensesByMonth(
    @CurrentUser('id',) userId: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return await this.statisticsService.getTotalExpensesByMonth(
      userId,
      year,
      month,
    );
  }
}
