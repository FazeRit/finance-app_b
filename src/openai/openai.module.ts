import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { ExpenseModule } from 'src/expenses/expense.module';

@Module({
  imports: [ExpenseModule],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAIModule {}
