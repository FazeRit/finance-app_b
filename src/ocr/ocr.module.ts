import { Module } from '@nestjs/common';
import { OCRService } from './ocr.service';
import { ExpenseModule } from 'src/expenses/expense.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ExpenseModule, HttpModule],
  providers: [OCRService],
  exports: [OCRService],
})
export class OCRModule {}
