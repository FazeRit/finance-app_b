import { HttpException, HttpStatus } from '@nestjs/common';

export class ExpenseFetchFailedException extends HttpException {
  constructor() {
    super(
      'Failed to fetch expenses. Please try again later.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
