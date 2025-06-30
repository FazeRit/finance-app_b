import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerModule } from '@nestjs/throttler';
import { ExpenseModule } from 'src/modules/expenses/expense.module';
import { OCRModule } from 'src/modules/ocr/ocr.module';

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
  providers: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
