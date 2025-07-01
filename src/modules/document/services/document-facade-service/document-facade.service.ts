import { ApiResponse } from 'src/shared/types/api-response.types';
import { ApiResponseFactory } from 'src/shared/factories/api-response.factory';
import { DocumentWriteService } from '../document-write-service/document-write.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentFacadeService {
	constructor(private readonly documentWriteService: DocumentWriteService) {}

	async uploadBankStatement(userId: string, file: Express.Multer.File): Promise<ApiResponse<string>> {
		const data = await this.documentWriteService.uploadBankStatement(userId, file);

		return ApiResponseFactory.createResponse({
			data: data.message,
		});
	}
}