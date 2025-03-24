import { Module } from '@nestjs/common';
import { OCRService } from './ocr.service';
import { ExpenseModule } from 'src/expenses/expense.module';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ExpenseModule,
    HttpModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 3,
        },
      ],
      errorMessage: 'Rate limit exceeded. Please try again after 60 seconds.',
    }),
  ],
  providers: [OCRService],
  exports: [OCRService],
})
export class OCRModule {}
