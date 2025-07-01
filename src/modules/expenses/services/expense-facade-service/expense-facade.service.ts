import { ApiResponse } from 'src/shared/types/api-response.types';
import { ApiResponseFactory } from 'src/shared/factories/api-response.factory';
import { CreateExpenseDto, UpdateExpenseDto } from '../../dto';
import { Expense } from '@prisma/client';
import { ExpenseReadService } from '../expense-read-service/expense-read.service';
import { ExpenseWriteService } from '../expense-write-service/expense-write.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExpenseFacadeService {
  constructor(
    private readonly expenseReadService: ExpenseReadService,
    private readonly expenseWriteService: ExpenseWriteService,
  ) {}

  async getExpenses(): Promise<ApiResponse<Expense[]>> {
    const expenses = await this.expenseReadService.getExpenses();
    return ApiResponseFactory.createResponse({
      data: expenses,
    });
  }

  async getExpenseById(id: string): Promise<ApiResponse<Expense>> {
    const expense = await this.expenseReadService.getExpenseById(id);
    return ApiResponseFactory.createResponse({
      data: expense,
    });
  }

  async createExpense(dto: CreateExpenseDto, userId: string): Promise<ApiResponse<Expense>> {
    const expense = await this.expenseWriteService.createExpense(dto, userId);
    return ApiResponseFactory.createResponse({
      data: expense,
    });
  }

  async updateExpense(id: string, dto: UpdateExpenseDto): Promise<ApiResponse<Expense>> {
    const expense = await this.expenseWriteService.updateExpense(id, dto);
    return ApiResponseFactory.createResponse({
      data: expense,
    });
  }

  async deleteExpense(id: string): Promise<ApiResponse<{ message: string }>> {
    await this.expenseWriteService.deleteExpense(id);
    return ApiResponseFactory.createResponse({
      data: { message: 'Expense deleted successfully' },
    });
  }
} 