import { Injectable } from "@nestjs/common";
import { Category } from "@prisma/client";
import { PrismaService } from "src/modules/prisma/prisma.service";

@Injectable()
export class CategoriesReadService {
	constructor(private prisma: PrismaService) {}

	async getCategories(): Promise<Array<Category>> {
		const categories = await this.prisma.category.findMany({
			select: {
				id: true,
				name: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		const expenseTotals = await this.prisma.expense.groupBy({
			by: ['categoryId'],
			_sum: {
				amount: true,
			},
			where: {
				categoryId: {
					not: null,
				},
			},
		});

		const totalsMap = new Map<string, number>();
			expenseTotals.forEach((total) => {
				if (total.categoryId) {
				totalsMap.set(total.categoryId, total._sum.amount || 0);
				}
		});

		const result = categories.map((category) => ({
			...category,
			totalSpent: totalsMap.get(category.id) || 0,
		}));

		return result;
	}
}