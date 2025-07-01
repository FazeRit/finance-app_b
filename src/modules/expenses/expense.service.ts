import { Injectable, NotFoundException, ConsoleLogger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';
import { ApiException } from 'src/shared/factories/api-exception.factory';

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

	async getExpenses(
		userId: string,
		take?: number,
		page = 1,
		limit = 10,
		sort?: 'asc' | 'desc',
	) {
		const actualLimit = take ?? limit;
		const skip = take ? undefined : (page - 1) * actualLimit;

		const expenses = await this.prismaService.expense.findMany({
			where: {
				userId
			},
			orderBy: {
				amount: sort || 'desc'
			},
			include: {
				category:{
					select: {
						name: true
					}
				}
			},
			take: actualLimit,
			skip,
		});

		const total = await this.prismaService.expense.count({
			where: {
				userId
			},
		});

		if (expenses.length === 0) {
			this.logger.warn(`No expenses found for user ${userId}`);
		}

		const totalPages = actualLimit > 0 ? Math.ceil(total / actualLimit) : 1;

		return {
			data: expenses,
			total,
			page,
			limit: actualLimit,
			totalPages,
		};
	}

	async getExpenseById(userId: string, expenseId: string) {
		const expense = await this.prismaService.expense.findFirst({
			where: {
				id: expenseId,
				userId
			},
			include: {
				category: {
					select: {
						name: true
					}
				}
			},
		});

		if (!expense) {
			this.logger.warn(`Expense ${expenseId} not found for user ${userId}`);
			throw ApiException.internal('Expense not found');
		}

		return expense;
	}

	async createExpense(userId: string, dto: CreateExpenseDto) {
		let parsedDate: Date;
		parsedDate = this.parseDate(dto.date)

		return await this.prismaService.expense.create({
			data: {
			user: {
				connect:{
					id: userId
				}
			},
			category: dto.categoryName
				? {
					connect:
					{
						name: dto.categoryName.toUpperCase()
					}
				}
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
	}

	async editExpenseById(
		userId: string,
		expenseId: string,
		dto: UpdateExpenseDto,
	) {
		const expense = await this.getExpenseById(userId, expenseId);
		if (!expense) throw new NotFoundException();

		const updateData: any = {
		amount: dto.amount,
		description: dto.description,
		};

		if (dto.date) {
			updateData.date = this.parseDate(dto.date);
		}

		return await this.prismaService.expense.update({
			where: {
				id:
				expenseId
			},
			data: updateData,
		});
	}

	async deleteExpenseById(userId: string, expenseId: string) {
		await this.getExpenseById(userId, expenseId);

		await this.prismaService.expense.delete({
			where: {
				id: expenseId
			}
		});

		return {
			message: 'Expense deleted successfully'
		};
	}
}
