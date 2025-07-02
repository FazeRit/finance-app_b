import { AuthGuard } from '@nestjs/passport';
import {
	Controller,
	HttpCode,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common';
import { CurrentUser } from 'src/shared/decorators/get-user.decorator';
import { DocumentFacadeService } from '../../services/document-facade-service/document-facade.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadDocumentDoc } from '../../docs';

@UseGuards(AuthGuard('jwt-access'))
@Controller('document')
export class DocumentController {
	constructor(private facade: DocumentFacadeService) {}

	@UploadDocumentDoc
	@HttpCode(200)
	@Post('bank-statement')
	@UseInterceptors(FileInterceptor('file'))
	async uploadBankStatement(
	  @CurrentUser('id',) userId: string,
	  @UploadedFile() file: Express.Multer.File,
	) {
	  await this.facade.uploadBankStatement(userId, file);
	}
  }
  