import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OCRService {
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

    const response = await firstValueFrom(
      this.http.post(
        'https://www.docuclipper.com/api/v1/protected/document',
        formData,
      ),
    );

    const documentId = response.data.document.id;
    return documentId;
  }

  async exportDataFromDocument(documentId: string) {
    const body = {
      documents: [documentId],
      enableBankMode: true,
      jobName: 'loh',
    };

    const response = await firstValueFrom(
      this.http.post(`https://www.docuclipper.com/api/v1/protected/job`, body),
    );

    const exportedDataId = response.data.id;
    return exportedDataId;
  }

  async getExportedData(jobId: string, documentId: string) {
    const body = {
      format: 'json',
      flattenTables: false,
      jobType: 'Invoice',
      dateFormat: 'YYYY-MM-DD',
      separateFilesForAccounts: false,
    };

    const response = await firstValueFrom(
      this.http.post(
        `https://www.docuclipper.com/api/v1/protected/job/${jobId}/export`,
        body,
      ),
    );

    const transactions =
      response.data[documentId]['account0'].bankMode.transactions;
    return transactions;
  }

  async getStatusOk(jobId: string): Promise<boolean> {
    const maxAttempts = 10;
    const delay = 1000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const response = await firstValueFrom(
        this.http.get(
          `https://www.docuclipper.com/api/v1/protected/job/${jobId}`,
        ),
      );

      const status = response.data.status;

      if (status === 'Succeeded') {
        return true;
      } else if (status === 'Failed') {
        throw new InternalServerErrorException(
          `Job processing failed for jobId ${jobId}`,
        );
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
