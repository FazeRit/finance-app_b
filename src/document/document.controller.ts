import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Post,
  UseGuards,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/utils/decorators/get-user.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt-access'))
@Controller('document')
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  @ApiOperation({ summary: 'Upload bank statement' })
  @ApiResponse({
    status: 200,
    description: 'Bank statement processed and expenses created successfully',
  })
  @ApiResponse({ status: 400, description: 'Failed to process document' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth('jwt-access')
  @ApiBody({
    description: 'Bank statement file',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @HttpCode(200)
  @Post('bank-statement')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBankStatement(
    @CurrentUser('id', ParseIntPipe) userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.documentService.uploadBankStatement(userId, file);
  }
}
