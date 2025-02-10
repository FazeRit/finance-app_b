import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExpenseCategory } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  // TODO: make getting categories, adding categories
  async getCategories() {
    const categories = await this.prismaService.category.findMany();

    return categories || [];
  }
}
