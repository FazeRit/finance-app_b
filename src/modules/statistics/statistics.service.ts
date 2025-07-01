import { Inject, Injectable, ConsoleLogger } from '@nestjs/common';
import { ExpenseService } from 'src/modules/expenses/expense.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class StatisticsService {
  private readonly logger = new ConsoleLogger(StatisticsService.name);

  constructor(
    private expenseService: ExpenseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private monthNames = Object.freeze([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]);

  private async getFilteredExpenses(
    userId: string,
    year?: number,
    month?: number,
  ) {
    try {
      const expenses = await this.expenseService.getExpenses(userId);
      const filtered = expenses.data.filter((expense) => {
        const expenseYear = expense.date.getFullYear();
        const expenseMonth = expense.date.getMonth() + 1;
        return (
          (!year || expenseYear === year) && (!month || expenseMonth === month)
        );
      });
      if (filtered.length === 0) {
        this.logger.warn(
          `No expenses found for user ${userId}, year ${year}, month ${month}`,
        );
      }
      return filtered;
    } catch (error) {
      this.logger.error(
        `Failed to fetch expenses for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getCategoryExpenses(userId: string, year?: number, month?: number) {
    const cacheKey = `category-${userId}-${year}-${month}`;
    const cached = await this.cacheManager.get<{
      dataPoints: { y: number; label: string }[];
    }>(cacheKey);
    if (cached) return cached;

    if (month && (month < 1 || month > 12)) {
      this.logger.error(`Invalid month ${month} provided for user ${userId}`);
      throw new Error('Month must be between 1 and 12');
    }

    const expenses = await this.getFilteredExpenses(userId, year, month);
    const categoryExpenses = expenses.reduce((acc, expense) => {
      const categoryName = expense.category?.name || 'Uncategorized';
      acc[categoryName] = (acc[categoryName] || 0) + expense.amount;
      return acc;
    }, {});

    const dataPoints = Object.entries(categoryExpenses).map(([label, y]) => ({
      y: y as number,
      label,
    }));
    try {
      await this.cacheManager.set(cacheKey, { dataPoints }, 10000);
    } catch (error) {
      this.logger.error(
        `Failed to cache category expenses for ${cacheKey}: ${error.message}`,
        error.stack,
      );
    }
    return { dataPoints };
  }

  async getTotalExpensesByYear(userId: string, year: number) {
    const cacheKey = `yearly-${userId}-${year}`;
    const cached = await this.cacheManager.get<{
      dataPoints: { y: number; label: string }[];
    }>(cacheKey);
    if (cached) return cached;

    const expenses = await this.getFilteredExpenses(userId, year);
    const monthlyTotals: { [key: string]: number } = this.monthNames.reduce(
      (acc, month) => ({ ...acc, [month]: 0 }),
      {},
    );

    expenses.forEach((expense) => {
      const monthIndex = expense.date.getMonth();
      const monthName = this.monthNames[monthIndex];
      monthlyTotals[monthName] += expense.amount;
    });

    const dataPoints = this.monthNames.map((label) => ({
      y: monthlyTotals[label],
      label,
    }));

    if (dataPoints.every((point) => point.y === 0)) {
      this.logger.warn(`No expenses found for user ${userId} in year ${year}`);
    }

    try {
      await this.cacheManager.set(cacheKey, { dataPoints }, 10000);
    } catch (error) {
      this.logger.error(
        `Failed to cache yearly expenses for ${cacheKey}: ${error.message}`,
        error.stack,
      );
    }
    return { dataPoints };
  }

  async getTotalExpensesByMonth(userId: string, year: number, month: number) {
    const cacheKey = `monthly-${userId}-${year}-${month}`;
    const cached = await this.cacheManager.get<{
      dataPoints: { y: number; label: string }[];
    }>(cacheKey);
    if (cached) return cached;

    if (month < 1 || month > 12) {
      this.logger.error(`Invalid month ${month} provided for user ${userId}`);
      throw new Error('Month must be between 1 and 12');
    }

    const expenses = await this.getFilteredExpenses(userId, year, month);
    const dataPoints = expenses.map((expense) => ({
      y: expense.amount,
      label: expense.description || 'Unnamed Expense',
    }));

    if (dataPoints.length === 0) {
      this.logger.warn(
        `No expenses found for user ${userId} in ${this.monthNames[month - 1]} ${year}`,
      );
    }

    try {
      await this.cacheManager.set(cacheKey, { dataPoints }, 10000);
    } catch (error) {
      this.logger.error(
        `Failed to cache monthly expenses for ${cacheKey}: ${error.message}`,
        error.stack,
      );
    }
    return { dataPoints };
  }
}
