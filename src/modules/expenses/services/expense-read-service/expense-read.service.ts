import { ApiException } from 'src/shared/factories/api-exception.factory';
import { Expense } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ExpenseReadService {
  constructor(private readonly prisma: PrismaService) {}

  async getExpenses(): Promise<Expense[]> {
    const expenses = await this.prisma.expense.findMany({
      orderBy: {
        date: 'desc',
      },
    });

    return expenses;
  }

  async getExpenseById(id: string): Promise<Expense> {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw ApiException.notFound('Expense not found');
    }

    return expense;
  }
} 