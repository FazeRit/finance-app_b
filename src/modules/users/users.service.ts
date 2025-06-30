import { ApiException } from 'src/shared/factories/api-exception.factory';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
	constructor(private prismaService: PrismaService) {}
 

	async getUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
		const user = await this.prismaService.user.findFirst({
			where,
		});

		if (!user) {
			throw ApiException.notFound('User not found');
		}

		return user;
	}

	async createUser(data: Prisma.UserCreateInput): Promise<User> {
		const user = await this.prismaService.user.create({
			data,
		})

		if (!user) {
			throw ApiException.notFound('User not found');
		}

		return user;
	}
}
