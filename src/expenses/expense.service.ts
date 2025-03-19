import { Injectable, NotFoundException, ConsoleLogger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';
import {
  ExpenseCreateFailedException,
  ExpenseFetchFailedException,
  ExpenseUpdateFailedException,
} from 'src/utils/exceptions';

@Injectable()
export class ExpenseService {
  private readonly logger = new ConsoleLogger(ExpenseService.name);

  constructor(private readonly prismaService: PrismaService) {}

  private parseDate(dateInput?: string | Date): Date {
    if (!dateInput) return new Date();

    if (dateInput instanceof Date) {
      if (isNaN(dateInput.getTime())) {
        this.logger.error(`Invalid date object provided: ${dateInput}`);
        throw new Error('Invalid date object');
      }
      return dateInput;
    }

    if (typeof dateInput === 'string' && /^\d{14}$/.test(dateInput)) {
      const year = dateInput.slice(0, 4);
      const month = parseInt(dateInput.slice(4, 6), 10) - 1;
      const day = dateInput.slice(6, 8);
      const hour = dateInput.slice(8, 10);
      const minute = dateInput.slice(10, 12);
      const second = dateInput.slice(12, 14);
      const parsed = new Date(
        Date.UTC(
          parseInt(year, 10),
          month,
          parseInt(day, 10),
          parseInt(hour, 10),
          parseInt(minute, 10),
          parseInt(second, 10),
        ),
      );
      if (isNaN(parsed.getTime())) {
        this.logger.error(`Invalid date string format: ${dateInput}`);
        throw new Error('Invalid date string');
      }
      return parsed;
    }

    const parsedDate = new Date(dateInput);
    if (isNaN(parsedDate.getTime())) {
      this.logger.error(`Invalid date string: ${dateInput}`);
      throw new Error('Invalid date string');
    }
    return parsedDate;
  }

  async getExpenses(userId: number) {
    try {
      const expenses = await this.prismaService.expense.findMany({
        where: { userId },
        include: { category: { select: { name: true } } },
      });
      if (expenses.length === 0) {
        this.logger.warn(`No expenses found for user ${userId}`);
      }
      return expenses;
    } catch (error) {
      this.logger.error(
        `Failed to fetch expenses for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw new ExpenseFetchFailedException();
    }
  }

  async getExpenseById(userId: number, expenseId: number) {
    const expense = await this.prismaService.expense.findFirst({
      where: { id: expenseId, userId },
    });

    if (!expense) {
      this.logger.warn(`Expense ${expenseId} not found for user ${userId}`);
      throw new ExpenseFetchFailedException();
    }
    return expense;
  }

  async createExpense(userId: number, dto: CreateExpenseDto) {
    let parsedDate: Date;
    try {
      parsedDate = this.parseDate(dto.date);
    } catch (error) {
      this.logger.error(
        `Failed to parse date for expense creation: ${dto.date}`,
        error.stack,
      );
      throw new ExpenseCreateFailedException();
    }

    try {
      return await this.prismaService.expense.create({
        data: {
          user: { connect: { id: userId } },
          category: dto.categoryId
            ? { connect: { id: dto.categoryId } }
            : undefined,
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
    } catch (error) {
      this.logger.error(
        `Failed to create expense for user ${userId}: ${error.message}`,
        error.stack,
      );
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
      } catch (error) {
        this.logger.error(
          `Failed to parse date for expense update: ${dto.date}`,
          error.stack,
        );
        throw new ExpenseUpdateFailedException();
      }
    }

    if (dto.categoryId !== undefined) {
      updateData.category = dto.categoryId
        ? { connect: { id: dto.categoryId } }
        : { disconnect: true };
    }

    try {
      return await this.prismaService.expense.update({
        where: { id: expenseId },
        data: updateData,
      });
    } catch (error) {
      this.logger.error(
        `Failed to update expense ${expenseId} for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw new ExpenseUpdateFailedException();
    }
  }

  async deleteExpenseById(userId: number, expenseId: number) {
    await this.getExpenseById(userId, expenseId);

    try {
      await this.prismaService.expense.delete({ where: { id: expenseId } });
      return { message: 'Expense deleted successfully' };
    } catch (error) {
      this.logger.error(
        `Failed to delete expense ${expenseId} for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
