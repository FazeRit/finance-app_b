import { ApiResponse } from 'src/shared/types/api-response.types';
import { CategoriesFacadeService } from '../../services/categories-facade-service/categories-facade.service';
import { Category } from '@prisma/client';
import { Controller } from '@nestjs/common';

@Controller('categories')
export class CategoriesReadController {
	constructor(private readonly facade: CategoriesFacadeService) {}

	public async getCategories(): Promise<ApiResponse<Category[]>> {
		return this.facade.getCategories();
	}
}