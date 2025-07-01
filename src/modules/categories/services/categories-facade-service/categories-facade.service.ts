import { Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "../../dto/request/create-category.dto";
import { CategoriesReadService } from "../categories-read-service/categories-read.service";
import { CategoriesWriteService } from "../categories-write-service/categories-write.service";
import { ApiResponse } from "src/shared/types/api-response.types";
import { Category } from "@prisma/client";
import { ApiResponseFactory } from "src/shared/factories/api-response.factory";

@Injectable()
export class CategoriesFacadeService {
	constructor(
		private readonly categoriesReadService: CategoriesReadService,
		private readonly categoriesWriteService: CategoriesWriteService,
	) {}

	async getCategories(): Promise<ApiResponse<Array<Category>>> {
		const data = await this.categoriesReadService.getCategories();

		return ApiResponseFactory.createResponse({
			data,
		});
	}

	async addCategory(dto: CreateCategoryDto): Promise<ApiResponse<Category>> {
		const data = await this.categoriesWriteService.addCategory(dto);

		return ApiResponseFactory.createResponse({
			data,
		});
	}
}