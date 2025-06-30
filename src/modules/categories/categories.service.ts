import { ConsoleLogger, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateCategoryDto } from './dto';
import { CategoryCreateFailed } from 'src/shared/exceptions/category/category-create-failed.exception';
import { CategoryAlreadyExistsException } from 'src/shared/exceptions';

@Injectable()
export class CategoriesService {
  private logger = new ConsoleLogger(CategoriesService.name);

  constructor(private prismaService: PrismaService) {}

  async getCategories() {
    const categories = await this.prismaService.category.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const expenseTotals = await this.prismaService.expense.groupBy({
      by: ['categoryId'],
      _sum: {
        amount: true,
      },
      where: {
        categoryId: {
          not: null,
        },
      },
    });

    const totalsMap = new Map<number, number>();
    expenseTotals.forEach((total) => {
      if (total.categoryId) {
        totalsMap.set(total.categoryId, total._sum.amount || 0);
      }
    });

    const result = categories.map((category) => ({
      ...category,
      totalSpent: totalsMap.get(category.id) || 0,
    }));

    return result;
  }

  async addCategory(dto: CreateCategoryDto) {
    const category = await this.prismaService.category.findUnique({
      where: { name: dto.name.toUpperCase() },
    });
    if (category) {
      this.logger.error(`Category with name ${dto.name} already exists`);
      throw new CategoryAlreadyExistsException();
    }

    const createdCategory = await this.prismaService.category.create({
      data: {
        ...dto,
        name: dto.name.toUpperCase(),
      },
    });
    if (!createdCategory) {
      this.logger.error(`Failed to create category with name ${dto.name}`);
      throw new CategoryCreateFailed();
    }

    return createdCategory;
  }
}
