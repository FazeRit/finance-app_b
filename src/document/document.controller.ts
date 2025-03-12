import {
  Controller,
  HttpException,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Post,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { PdfReader } from 'pdfreader';

@Controller('document')
export class DocumentController {
  private pdfReader: PdfReader;

  constructor(private readonly documentService: DocumentService) {
    this.pdfReader = new PdfReader();
  }

  @Post('bank-statement')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBankStatement(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      const extractedText = await this.extractTextFromPDF(file.buffer);

      return {
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        extractedText,
        message: 'PDF uploaded and processed successfully',
      };
    } catch (error) {
      throw new HttpException(
        `Failed to process PDF: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private extractTextFromPDF(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      let text = '';

      this.pdfReader.parseBuffer(buffer, (err, item) => {
        if (err) {
          reject(new Error(`PDF parsing error: ${err}`));
        } else if (!item) {
          resolve(text.trim());
        } else if (item.text) {
          text += item.text + ' ';
        }
      });
    });
  }
}
