import { Category } from "@prisma/client";

export class CategoryEntity implements Category {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}