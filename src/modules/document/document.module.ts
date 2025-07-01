import { DocumentController } from './controllers/document-write-controller/document-write.controller';
import { DocumentFacadeService } from './services/document-facade-service/document-facade.service';
import { DocumentWriteService } from './services/document-write-service/document-write.service';
import { ExpenseModule } from 'src/modules/expenses/expense.module';
import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { OCRModule } from 'src/modules/ocr/ocr.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
	imports: [
		ThrottlerModule.forRoot({
		throttlers: [
			{
			ttl: 60000,
			limit: 3,
			},
		],
		errorMessage: 'Rate limit exceeded. Please try again after 60 seconds.',
		}),
		MulterModule.register({
		limits: {
			fileSize: 1024 * 1024 * 10,
		},
		fileFilter: (req, file, callback) => {
			if (!file.mimetype.includes('pdf')) {
			return callback(
				new HttpException(
				'Only PDF files are allowed!',
				HttpStatus.BAD_REQUEST,
				),
				false,
			);
			}
			callback(null, true);
		},
		}),
		ExpenseModule,
		OCRModule,
	],
	providers: [DocumentFacadeService, DocumentWriteService],
	controllers: [DocumentController],
	exports: [DocumentFacadeService],
})
export class DocumentModule {}
