import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/shared/types/api-response.types';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesFacadeService } from '../../services/categories-facade-service/categories-facade.service';
import { Category } from '@prisma/client';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetCategoriesDoc } from '../../docs';

@ApiTags('categories')
@ApiBearerAuth('jwt-access')
@UseGuards(AuthGuard('jwt-access'))
@Controller('categories')
export class CategoriesReadController {
	constructor(private readonly facade: CategoriesFacadeService) {}

	@GetCategoriesDoc
	@Get()
	public async getCategories(): Promise<ApiResponse<Category[]>> {
		return this.facade.getCategories();
	}
}