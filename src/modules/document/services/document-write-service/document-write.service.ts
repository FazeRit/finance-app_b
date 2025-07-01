import { BadRequestException, ConsoleLogger, Injectable } from '@nestjs/common';
import { ExpenseWriteService } from 'src/modules/expenses/services/expense-write-service/expense-write.service';
import { OCRService } from 'src/modules/ocr/ocr.service';

@Injectable()
export class DocumentWriteService {
		private logger = new ConsoleLogger(DocumentWriteService.name);

	constructor(
		private readonly ocrService: OCRService,
		private readonly expenseService: ExpenseWriteService,
	) {}

	async uploadBankStatement(userId: string, file: Express.Multer.File): Promise<{ message: string }> {
		const uploadedDocumentId = await this.ocrService.uploadDocument(file);

		const documentId =
			await this.ocrService.exportDataFromDocument(uploadedDocumentId);

		const isOk = await this.ocrService.getStatusOk(documentId);

		if (!isOk) {
			this.logger.error(
				`Failed to process document ${documentId} for user ${userId}`,
			);
			throw new BadRequestException('Failed to process document');
		}

		const transactions = await this.ocrService.getExportedData(
			documentId,
			uploadedDocumentId,
		)

		const expenseTransactions = transactions.filter(
			(transaction: any) => transaction.amount < 0,
		);

		if (expenseTransactions.length === 0) {
			this.logger.warn(
				`No expense transactions found in bank statement for user ${userId}, document ${documentId}`,
			);
		}

		await Promise.all(
			expenseTransactions.map(
				async (transaction: {
				amount: number;
				descriptionLines: string[];
				date?: string;
				}) => {
				const expenseDto = {
					amount: Math.abs(transaction.amount),
					description: transaction.descriptionLines[0] || 'Bank expense',
					date: transaction.date || new Date().toISOString(),
					categoryId: undefined,
				};

				return this.expenseService.createExpense(expenseDto, userId);
				},
			),
		);

		return {
			message: 'Bank statement processed and expenses created successfully',
		};
	}
}
