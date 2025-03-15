import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { OCRService } from 'src/ocr/ocr.service';
import { ExpenseService } from 'src/expenses/expense.service';

@Injectable()
export class DocumentService {
  constructor(
    private readonly ocrService: OCRService,
    private readonly expenseService: ExpenseService,
  ) {}

  async uploadBankStatement(userId: number, file: Express.Multer.File) {
    try {
      if (!file) {
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }

      const uploadedDocumentId = await this.ocrService.uploadDocument(file);
      const documentId =
        await this.ocrService.exportDataFromDocument(uploadedDocumentId);
      const isOk = await this.ocrService.getStatusOk(documentId);
      if (!isOk) {
        throw new BadRequestException('Failed to process document');
      }
      const transactions = await this.ocrService.getExportedData(
        documentId,
        uploadedDocumentId,
      );

      const expenseTransactions = transactions.filter(
        (transaction: any) => transaction.amount < 0,
      );

      await Promise.all(
        expenseTransactions.map(async (transaction: any) => {
          const expenseDto = {
            amount: Math.abs(transaction.amount),
            description: transaction.descriptionLines[0] || 'Bank expense',
            date: transaction.date || new Date().toISOString(),
            categoryId: undefined,
          };

          return this.expenseService.createExpense(userId, expenseDto);
        }),
      );

      return {
        message: 'Bank statement processed and expenses created successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to upload bank statement',
      );
    }
  }
}
