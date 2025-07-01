import { Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "../../dto/request/create-category.dto";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { ApiException } from "src/shared/factories/api-exception.factory";
import { Category } from "@prisma/client";

@Injectable()
export class CategoriesWriteService {
	constructor(private prisma: PrismaService) {}

	public async addCategory(dto: CreateCategoryDto): Promise<Category> {
		const category = await this.prisma.category.findUnique({
			where: { name: dto.name.toUpperCase() },
		});
		if (category) {
			throw ApiException.conflict('Category already exists');
		}

		const createdCategory = await this.prisma.category.create({
			data: {
				...dto,
				name: dto.name.toUpperCase(),
			},
		});

		if (!createdCategory) {
			throw ApiException.internal('Failed to create category');
		}

		return createdCategory;
	}
}