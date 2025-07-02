import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth-user/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { ExpenseModule } from './modules/expenses/expense.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { DocumentModule } from './modules/document/document.module';
import { OCRModule } from './modules/ocr/ocr.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { EnvModule } from './modules/env/env.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
	imports: [
		AuthModule,
		PrismaModule,
		ConfigModule.forRoot({
			isGlobal: true,
		},),
		CacheModule.register({
			isGlobal: true,
			store: 'memory',
			max: 1000, // Maximum number of items in cache
			ttl: 3600, // Time to live in seconds
		}),
		UsersModule,
		ExpenseModule,
		EnvModule,
		CategoriesModule,
		DocumentModule,
		OCRModule,
		StatisticsModule,
	],
})
export class AppModule {}
