import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto';
import { CategoryCreateFailed } from 'src/utils/exceptions/category/category-create-failed.exception';
import { CategoryAlreadyExistsException } from 'src/utils/exceptions';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async getCategories() {
    const categories = await this.prismaService.category.findMany();

    return categories || [];
  }

  async addCategory(dto: CreateCategoryDto) {
    const category = await this.prismaService.category.findUnique({
      where: { name: dto.name },
    });
    if (category) throw new CategoryAlreadyExistsException();

    const createdCategory = await this.prismaService.category.create({
      data: {
        ...dto,
      },
    });
    if (!createdCategory) throw new CategoryCreateFailed();

    return createdCategory;
  }
}
