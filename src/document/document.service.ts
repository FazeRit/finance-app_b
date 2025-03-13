import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as pdfParse from 'pdf-parse';
import { OpenAIService } from 'src/openai/openai.service';
import { ExpenseService } from 'src/expenses/expense.service';

@Injectable()
export class DocumentService {
  constructor(
    private readonly openAIService: OpenAIService,
    private readonly expenseService: ExpenseService,
  ) {}

  async uploadBankStatement(userId: number, file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      const extractedText = await this.extractTextFromPDF(file.buffer);
      if (!extractedText.trim()) {
        throw new HttpException(
          'No text extracted from the PDF',
          HttpStatus.BAD_REQUEST,
        );
      }

      const expenses =
        await this.openAIService.extractExpensesFromText(extractedText);

      const savedExpenses = await Promise.all(
        expenses.map((expense) =>
          this.expenseService.createExpense(userId, {
            amount: expense.amount,
            categoryId: expense.categoryId ?? undefined,
            description: expense.description,
            date: expense.date,
          }),
        ),
      );

      return {
        message: 'Expenses extracted and saved successfully',
        expenses: savedExpenses,
      };
    } catch {
      throw new InternalServerErrorException(`Failed to process PDF`);
    }
  }

  private async extractTextFromPDF(buffer: Buffer): Promise<string> {
    const data = await pdfParse(buffer);
    return data.text;
  }
}
