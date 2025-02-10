import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/index';
import {
  ExpenseCreateFailedException,
  ExpenseFetchFailedException,
} from 'src/utils/exceptions';
import { ExpenseUpdateFailedException } from 'src/utils/exceptions/expense/expense-update-failed.exception';

@Injectable()
export class ExpenseService {
  constructor(private prismaService: PrismaService) {}

  async getExpenses(userId: number) {
    const expenses = await this.prismaService.expense.findMany({
      where: { userId },
    });

    return expenses || [];
  }

  async createExpense(userId: number, dto: CreateExpenseDto) {
    const expense = await this.prismaService.expense.create({
      data: {
        userId,
        ...dto,
      },
      select: {
        amount: true,
        category: true,
        description: true,
        date: true,
      },
    });
    if (!expense) throw new ExpenseCreateFailedException();

    return expense;
  }

  async getExpenseById(userId: number, expenseId: number) {
    const expense = await this.prismaService.expense.findFirst({
      where: {
        id: expenseId,
        userId,
      },
    });
    if (!expense) throw new ExpenseFetchFailedException();

    return expense;
  }

  async deleteExpenseById(userId: number, expenseId: number) {
    const expense = await this.prismaService.expense.findFirst({
      where: {
        id: expenseId,
        userId,
      },
    });
    if (!expense) throw new ExpenseFetchFailedException();

    const deletedExpense = await this.prismaService.expense.delete({
      where: { id: expenseId },
    });

    if (!deletedExpense) throw new ExpenseCreateFailedException();

    return { message: 'Expense deleted succsesfully' };
  }

  async editExpenseById(
    userId: number,
    expenseId: number,
    dto: UpdateExpenseDto,
  ) {
    const editedExpense = await this.prismaService.expense.update({
      where: {
        userId,
        id: expenseId,
      },
      data: {
        ...dto,
      },
    });
    if (!editedExpense) throw new ExpenseUpdateFailedException();

    return editedExpense;
  }
}
