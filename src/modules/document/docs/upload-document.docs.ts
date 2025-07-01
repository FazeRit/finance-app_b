import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiResponse
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

class UploadDocumentResponse {
  message: string;
  processedExpenses: number;
}

export const UploadDocumentDoc = applyDecorators(
  ApiOperation({ summary: 'Upload bank statement' }),
  ApiBearerAuth('jwt-access'),
  ApiConsumes('multipart/form-data'),
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Bank statement file (PDF, image, etc.)',
        },
      },
      required: ['file'],
    },
  }),
  ApiResponse({
    status: 201,
    description: 'Document uploaded and processed successfully',
    type: UploadDocumentResponse,
  }),
  ApiResponse({ status: 400, description: 'Failed to process document' }),
  ApiResponse({ status: 401, description: 'Unauthorized' }),
  ApiResponse({ status: 500, description: 'Internal server error' }),
) 