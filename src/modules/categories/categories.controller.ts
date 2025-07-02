import { ApiResponse } from 'src/shared/types/api-response.types';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesFacadeService } from './services/categories-facade-service/categories-facade.service';
import { Category } from '@prisma/client';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetCategoriesDoc } from './docs';

@ApiTags('categories')
@UseGuards(AuthGuard('jwt-access'))
@Controller('categories')
export class CategoriesController {
  constructor(private facade: CategoriesFacadeService) {}

  @GetCategoriesDoc
  @Get()
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.facade.getCategories();
  }
}
