import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerModule } from '@nestjs/throttler';
import { ExpenseModule } from 'src/expenses/expense.module';
import { OpenAIModule } from 'src/openai/openai.module'; // Import OpenAIModule

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
    OpenAIModule,
  ],
  providers: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
