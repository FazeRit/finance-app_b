import { ApiResponse } from 'src/shared/types/api-response.types';
import { ApiResponseFactory } from 'src/shared/factories/api-response.factory';
import { Injectable } from '@nestjs/common';
import { StatisticsReadService } from '../statistics-read-service/statistics-read.service';

@Injectable()
export class StatisticsFacadeService {
  constructor(
    private readonly statisticsReadService: StatisticsReadService,
  ) {}

  async getMonthStatistics(month?: string, year?: string): Promise<ApiResponse<any>> {
    const statistics = await this.statisticsReadService.getMonthStatistics(month, year);
    return ApiResponseFactory.createResponse({
      data: statistics,
    });
  }

  async getYearStatistics(year?: string): Promise<ApiResponse<any>> {
    const statistics = await this.statisticsReadService.getYearStatistics(year);
    return ApiResponseFactory.createResponse({
      data: statistics,
    });
  }

  async getDetailedExpenses(month: number, year: number): Promise<ApiResponse<any>> {
    const expenses = await this.statisticsReadService.getDetailedExpenses(month, year);
    return ApiResponseFactory.createResponse({
      data: expenses,
    });
  }
} 