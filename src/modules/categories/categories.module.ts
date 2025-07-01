import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { CategoriesWriteController } from './controllers/categories-write-controller/categories-write.controller';
import { CategoriesReadController } from './controllers/categories-read-controller/categories-read.controller';
import { CategoriesFacadeService } from './services/categories-facade-service/categories-facade.service';
import { CategoriesWriteService } from './services/categories-write-service/categories-write.service';
import { CategoriesReadService } from './services/categories-read-service/categories-read.service';

@Module({
	imports: [PrismaModule],
	controllers: [
		CategoriesWriteController,
		CategoriesReadController
	],
	providers: [
		CategoriesFacadeService,
		CategoriesWriteService,
		CategoriesReadService
	],
})
export class CategoriesModule {}
