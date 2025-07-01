import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class StatisticsReadService {
  constructor(private readonly prisma: PrismaService) {}

  async getMonthStatistics(month?: string, year?: string) {
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    const expenses = await this.prisma.expense.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const categoryBreakdown = expenses.reduce((acc, expense) => {
      const categoryId = expense.categoryId || 'uncategorized';
      const categoryName = expense.category?.name || 'Uncategorized';
      
      if (!acc[categoryId]) {
        acc[categoryId] = {
          categoryId,
          categoryName,
          totalAmount: 0,
        };
      }
      
      acc[categoryId].totalAmount += expense.amount;
      return acc;
    }, {} as Record<string, any>);

    const categoryArray = Object.values(categoryBreakdown).map((category: any) => ({
      ...category,
      percentage: totalExpenses > 0 ? (category.totalAmount / totalExpenses) * 100 : 0,
    }));

    const prevStartDate = new Date(targetYear, targetMonth - 1, 1);
    const prevEndDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const prevExpenses = await this.prisma.expense.findMany({
      where: {
        date: {
          gte: prevStartDate,
          lte: prevEndDate,
        },
      },
    });

    const prevTotalExpenses = prevExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const percentageChange = prevTotalExpenses > 0 
      ? ((totalExpenses - prevTotalExpenses) / prevTotalExpenses) * 100 
      : 0;

    return {
      totalExpenses,
      categoryBreakdown: categoryArray,
      currentMonth: `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}`,
      previousMonth: {
        totalExpenses: prevTotalExpenses,
        percentageChange,
      },
    };
  }

  async getYearStatistics(year?: string) {
    const currentYear = new Date().getFullYear();
    const targetYear = year ? parseInt(year) : currentYear;

    const startDate = new Date(targetYear, 0, 1);
    const endDate = new Date(targetYear, 11, 31, 23, 59, 59);

    const expenses = await this.prisma.expense.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const monthlyBreakdown = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const monthExpenses = expenses.filter(expense => {
        const expenseMonth = expense.date.getMonth() + 1;
        return expenseMonth === month;
      });
      
      return {
        month: `${targetYear}-${String(month).padStart(2, '0')}`,
        totalAmount: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      };
    });

    const categoryBreakdown = expenses.reduce((acc, expense) => {
      const categoryId = expense.categoryId || 'uncategorized';
      const categoryName = expense.category?.name || 'Uncategorized';
      
      if (!acc[categoryId]) {
        acc[categoryId] = {
          categoryId,
          categoryName,
          totalAmount: 0,
        };
      }
      
      acc[categoryId].totalAmount += expense.amount;
      return acc;
    }, {} as Record<string, any>);

    const categoryArray = Object.values(categoryBreakdown).map((category: any) => ({
      ...category,
      percentage: totalExpenses > 0 ? (category.totalAmount / totalExpenses) * 100 : 0,
    }));

    return {
      totalExpenses,
      monthlyBreakdown,
      categoryBreakdown: categoryArray,
      year: targetYear,
    };
  }

  async getDetailedExpenses(month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const expenses = await this.prisma.expense.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      expenses,
      total,
      month: String(month).padStart(2, '0'),
      year,
    };
  }
} 