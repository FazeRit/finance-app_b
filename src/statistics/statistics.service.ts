import { Injectable } from '@nestjs/common';
import { ExpenseService } from 'src/expenses/expense.service';

@Injectable()
export class StatisticsService {
  constructor(private expenseService: ExpenseService) {}

  private monthNames = [
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
  ];

  private async getFilteredExpenses(
    userId: number,
    year?: number,
    month?: number,
  ) {
    const expenses = await this.expenseService.getExpenses(userId);
    return expenses.filter((expense) => {
      const expenseYear = expense.date.getFullYear();
      const expenseMonth = expense.date.getMonth() + 1;
      return (
        (!year || expenseYear === year) && (!month || expenseMonth === month)
      );
    });
  }

  async getCategoryExpenses(userId: number, year?: number, month?: number) {
    const expenses = await this.getFilteredExpenses(userId, year, month);

    const categoryExpenses = expenses.reduce((acc, expense) => {
      const categoryName = expense.category?.name || 'Uncategorized';
      acc[categoryName] = (acc[categoryName] || 0) + expense.amount;
      return acc;
    }, {});

    const dataPoints = Object.entries(categoryExpenses).map(([label, y]) => ({
      y,
      label,
    }));

    return { dataPoints };
  }

  async getTotalExpensesByYear(userId: number, year: number) {
    const expenses = await this.getFilteredExpenses(userId, year);

    const yearlyExpenses: { [key: string]: { y: number; label: string }[] } =
      expenses.reduce((acc, expense) => {
        const categoryName = expense.category?.name || 'Uncategorized';

        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }

        acc[categoryName].push({
          y: expense.amount,
          label: expense.description || 'Unnamed Expense',
        });

        return acc;
      }, {});

    const dataPoints = Object.entries(yearlyExpenses).flatMap(
      ([category, expenseList]) =>
        expenseList.map((expense) => ({
          y: expense.y,
          label: `${category} - ${expense.label}`,
        })),
    );

    return { dataPoints };
  }

  async getTotalExpensesByMonth(userId: number, year: number, month?: number) {
    const expenses = await this.getFilteredExpenses(userId, year, month);

    const monthlyExpenses: { [key: string]: { y: number; label: string }[] } =
      expenses.reduce((acc, expense) => {
        const expenseMonth = expense.date.getMonth() + 1;
        const monthName = this.monthNames[expenseMonth - 1];

        if (!acc[monthName]) {
          acc[monthName] = [];
        }

        acc[monthName].push({
          y: expense.amount,
          label: expense.description || 'Unnamed Expense',
        });

        return acc;
      }, {});

    const dataPoints = Object.entries(monthlyExpenses).flatMap(
      ([monthName, expenseList]) =>
        expenseList.map((expense) => ({
          y: expense.y,
          label: `${monthName} - ${expense.label}`,
        })),
    );

    return { dataPoints };
  }
}
