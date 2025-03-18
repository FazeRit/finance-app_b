import {
  Controller,
  Get,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/utils/decorators/get-user.decorator';
import { StatisticsService } from './statistics.service';

@UseGuards(AuthGuard('jwt-access'))
@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @Get('category-expenses-by-month')
  async getCategoryExpenses(
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return await this.statisticsService.getCategoryExpenses(
      userId,
      year,
      month,
    );
  }

  @Get('total-expenses-by-year')
  async getTotalExpensesByYear(
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Query('year', ParseIntPipe) year: number,
  ) {
    return await this.statisticsService.getTotalExpensesByYear(userId, year);
  }

  @Get('total-expenses-by-month')
  async getTotalExpensesByMonth(
    @CurrentUser('id', ParseIntPipe) userId: number,
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
