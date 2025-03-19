import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  ConsoleLogger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OCRService {
  private readonly logger = new ConsoleLogger(OCRService.name);
  private token: string;

  constructor(
    private http: HttpService,
    private config: ConfigService,
  ) {
    this.token = `Bearer ${config.getOrThrow('OCR_API_KEY')}`;
    this.http.axiosRef.defaults.headers.common['Authorization'] = this.token;
  }

  async uploadDocument(file: Express.Multer.File) {
    const formData = new FormData();
    const blob = new Blob([file.buffer], { type: file.mimetype });
    formData.append('document', blob, file.originalname);

    try {
      const response = await firstValueFrom(
        this.http.post(
          'https://www.docuclipper.com/api/v1/protected/document',
          formData,
        ),
      );
      const documentId = response.data.document.id;
      return documentId;
    } catch (error) {
      this.logger.error(
        `Failed to upload document ${file.originalname}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async exportDataFromDocument(documentId: string) {
    const body = {
      documents: [documentId],
      enableBankMode: true,
      jobName: 'loh',
    };

    try {
      const response = await firstValueFrom(
        this.http.post(
          `https://www.docuclipper.com/api/v1/protected/job`,
          body,
        ),
      );
      const exportedDataId = response.data.id;
      return exportedDataId;
    } catch (error) {
      this.logger.error(
        `Failed to export data from document ${documentId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getExportedData(jobId: string, documentId: string) {
    const body = {
      format: 'json',
      flattenTables: false,
      jobType: 'Invoice',
      dateFormat: 'YYYY-MM-DD',
      separateFilesForAccounts: false,
    };

    try {
      const response = await firstValueFrom(
        this.http.post(
          `https://www.docuclipper.com/api/v1/protected/job/${jobId}/export`,
          body,
        ),
      );
      const transactions =
        response.data[documentId]?.['account0']?.bankMode?.transactions;
      if (!transactions) {
        this.logger.warn(
          `No transactions found for job ${jobId}, document ${documentId}`,
        );
      }
      return transactions || [];
    } catch (error) {
      this.logger.error(
        `Failed to fetch exported data for job ${jobId}, document ${documentId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getStatusOk(jobId: string): Promise<boolean> {
    const maxAttempts = 10;
    const delay = 1000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await firstValueFrom(
          this.http.get(
            `https://www.docuclipper.com/api/v1/protected/job/${jobId}`,
          ),
        );
        const status = response.data.status;

        if (status === 'Succeeded') {
          return true;
        } else if (status === 'Failed') {
          this.logger.error(`Job ${jobId} failed`);
          throw new InternalServerErrorException(
            `Job processing failed for jobId ${jobId}`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Failed to check status for job ${jobId} on attempt ${attempt}: ${error.message}`,
          error.stack,
        );
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    this.logger.warn(
      `Job ${jobId} did not complete after ${maxAttempts} attempts`,
    );
    return false;
  }
}
