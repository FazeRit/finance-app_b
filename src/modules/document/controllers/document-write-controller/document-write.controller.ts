import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiResponse
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
	Controller,
	HttpCode,
	ParseIntPipe,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common';
import { CurrentUser } from 'src/shared/decorators/get-user.decorator';
import { DocumentFacadeService } from '../../services/document-facade-service/document-facade.service';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard('jwt-access'))
@Controller('document')
export class DocumentController {
	constructor(private facade: DocumentFacadeService) {}

	@ApiOperation({ summary: 'Upload bank statement' })
	@ApiResponse({
	  status: 200,
	  description: 'Bank statement processed and expenses created successfully',
	})
	@ApiResponse({ status: 400, description: 'Failed to process document' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	@ApiBearerAuth('jwt-access')
	@ApiConsumes('multipart/form-data')
	@ApiBody({
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
	  @CurrentUser('id',) userId: string,
	  @UploadedFile() file: Express.Multer.File,
	) {
	  await this.facade.uploadBankStatement(userId, file);
	}
  }
  