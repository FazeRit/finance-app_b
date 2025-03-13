import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Category } from '@prisma/client';

import { ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

class CategoryEntity implements Category {
  @ApiProperty({ description: 'Name of the category', example: 'Food' })
  name: string;

  @ApiProperty({ description: 'Unique identifier of the category', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-03-12T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-03-12T12:00:00Z',
  })
  updatedAt: Date;
}

@ApiTags('categories')
@UseGuards(AuthGuard('jwt-access'))
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Get all categories for expenses' })
  @ApiResponse({
    status: 200,
    description: 'Categories fetched successfully',
    type: [CategoryEntity],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get()
  async getCategories(): Promise<Category[]> {
    return this.categoriesService.getCategories();
  }

  @ApiOperation({ summary: 'Create new category for expenses' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: CategoryEntity,
  })
  @ApiResponse({
    status: 409,
    description: 'Category with this name already exists',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBody({ type: CreateCategoryDto })
  @Post()
  async addCategory(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.addCategory(dto);
  }
}
