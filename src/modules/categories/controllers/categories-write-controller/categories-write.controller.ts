import { Category } from '@prisma/client';
import { Controller, Post } from '@nestjs/common';
import { CreateCategoryDto } from '../../dto/request/create-category.dto';
import { ApiResponse } from '../../../../shared/types/api-response.types';
import { CreateCategoryDoc } from '../../docs';
import { CategoriesFacadeService } from '../../services/categories-facade-service/categories-facade.service';
import { ApiResponseFactory } from 'src/shared/factories/api-response.factory';

@Controller('categories')
export class CategoriesWriteController {
	constructor(private readonly facade: CategoriesFacadeService) {}

	@CreateCategoryDoc
	@Post()
	public async addCategory(dto: CreateCategoryDto): Promise<ApiResponse<Category>> {
		return this.facade.addCategory(dto)
	}
}