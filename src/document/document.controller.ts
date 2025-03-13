import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Post,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/utils/decorators/get-user.decorator';

@UseGuards(AuthGuard('jwt-access'))
@Controller('document')
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  @Post('bank-statement')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBankStatement(
    @CurrentUser('id', ParseIntPipe) userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.documentService.uploadBankStatement(userId, file);
  }
}
