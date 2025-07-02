import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
	Controller,
	Get,
	ParseIntPipe,
	Query,
	UseGuards
} from '@nestjs/common';
import { GetDetailedExpensesDoc, GetMonthStatisticsDoc, GetYearStatisticsDoc } from '../../docs';
import { StatisticsFacadeService } from '../../services/statistics-facade-service/statistics-facade.service';

@ApiTags('statistics')
@ApiBearerAuth('jwt-access')
@UseGuards(AuthGuard('jwt-access'))
@Controller('statistics')
export class StatisticsReadController {
  constructor(private readonly facade: StatisticsFacadeService) {}

  @GetMonthStatisticsDoc
  @Get('month')
  async getMonthStatistics(
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.facade.getMonthStatistics(month, year);
  }

  @GetYearStatisticsDoc
  @Get('year')
  async getYearStatistics(@Query('year') year?: string) {
    return this.facade.getYearStatistics(year);
  }

  @GetDetailedExpensesDoc
  @Get('detailed')
  async getDetailedExpenses(
    @Query('month', ParseIntPipe) month: number,
    @Query('year', ParseIntPipe) year: number,
  ) {
    return this.facade.getDetailedExpenses(month, year);
  }
} 