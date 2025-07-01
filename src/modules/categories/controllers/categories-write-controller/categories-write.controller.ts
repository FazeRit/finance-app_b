import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '../../../../shared/types/api-response.types';
import { AuthGuard } from '@nestjs/passport';
import {
	Body,
	Controller,
	Post,
	UseGuards
} from '@nestjs/common';
import { CategoriesFacadeService } from '../../services/categories-facade-service/categories-facade.service';
import { Category } from '@prisma/client';
import { CreateCategoryDoc } from '../../docs';
import { CreateCategoryDto } from '../../dto/request/create-category.dto';

@ApiTags('categories')
@ApiBearerAuth('jwt-access')
@UseGuards(AuthGuard('jwt-access'))
@Controller('categories')
export class CategoriesWriteController {
	constructor(private readonly facade: CategoriesFacadeService) {}

	@CreateCategoryDoc
	@Post()
	public async addCategory(@Body() dto: CreateCategoryDto): Promise<ApiResponse<Category>> {
		return this.facade.addCategory(dto);
	}
}