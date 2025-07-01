import { ApiException } from 'src/shared/factories/api-exception.factory';
import { CreateExpenseDto, UpdateExpenseDto } from '../../dto';
import { Expense, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ExpenseWriteService {
  constructor(private readonly prisma: PrismaService) {}

  async createExpense(dto: CreateExpenseDto, userId: string): Promise<Expense> {
    const expense = await this.prisma.expense.create({
		data: {
			...dto,
			userId,
		},
    });

    if (!expense) {
      throw ApiException.internal('Failed to create expense');
    }

    return expense;
  }

  async updateExpense(id: string, dto: Prisma.ExpenseUpdateInput): Promise<Expense> {
    const existingExpense = await this.prisma.expense.findUnique({
      where: { id },
    });

    if (!existingExpense) {
      throw ApiException.notFound('Expense not found');
    }

    const updatedExpense = await this.prisma.expense.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.date && { date: dto.date }),
      },
    });

    return updatedExpense;
  }

  async deleteExpense(id: string): Promise<void> {
    const existingExpense = await this.prisma.expense.findUnique({
      where: { id },
    });

    if (!existingExpense) {
      throw ApiException.notFound('Expense not found');
    }

    await this.prisma.expense.delete({
      where: { id },
    });
  }
} 