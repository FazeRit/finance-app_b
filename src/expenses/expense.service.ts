import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';
import {
  ExpenseCreateFailedException,
  ExpenseFetchFailedException,
  ExpenseUpdateFailedException,
} from 'src/utils/exceptions';

@Injectable()
export class ExpenseService {
  constructor(private readonly prismaService: PrismaService) {}

  private parseDate(dateInput?: string | Date): Date {
    if (!dateInput) return new Date();

    if (dateInput instanceof Date) {
      if (isNaN(dateInput.getTime())) throw new Error('Invalid date object');
      return dateInput;
    }

    const parsedDate = new Date(dateInput);
    if (isNaN(parsedDate.getTime())) throw new Error('Invalid date string');

    return parsedDate;
  }

  async getExpenses(userId: number) {
    return this.prismaService.expense.findMany({ where: { userId } });
  }

  async getExpenseById(userId: number, expenseId: number) {
    const expense = await this.prismaService.expense.findFirst({
      where: { id: expenseId, userId },
    });

    if (!expense) throw new ExpenseFetchFailedException();

    return expense;
  }

  async createExpense(userId: number, dto: CreateExpenseDto) {
    const category = await this.prismaService.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) throw new ExpenseCreateFailedException();

    let parsedDate: Date;
    try {
      parsedDate = this.parseDate(dto.date);
    } catch {
      throw new ExpenseCreateFailedException();
    }

    try {
      return await this.prismaService.expense.create({
        data: {
          userId,
          categoryId: category.id,
          amount: dto.amount,
          description: dto.description,
          date: parsedDate,
        },
        select: {
          amount: true,
          category: { select: { name: true } },
          description: true,
          date: true,
        },
      });
    } catch {
      throw new ExpenseCreateFailedException();
    }
  }

  async editExpenseById(
    userId: number,
    expenseId: number,
    dto: UpdateExpenseDto,
  ) {
    const expense = await this.getExpenseById(userId, expenseId);
    if (!expense) throw new NotFoundException();

    const updateData: any = {
      amount: dto.amount,
      description: dto.description,
    };

    if (dto.date) {
      try {
        updateData.date = this.parseDate(dto.date);
      } catch {
        throw new ExpenseUpdateFailedException();
      }
    }

    if (dto.categoryId) {
      updateData.category = { connect: { id: dto.categoryId } };
    }

    try {
      return await this.prismaService.expense.update({
        where: { id: expenseId },
        data: updateData,
      });
    } catch {
      throw new ExpenseUpdateFailedException();
    }
  }

  async deleteExpenseById(userId: number, expenseId: number) {
    await this.getExpenseById(userId, expenseId);

    await this.prismaService.expense.delete({ where: { id: expenseId } });

    return { message: 'Expense deleted successfully' };
  }
}
