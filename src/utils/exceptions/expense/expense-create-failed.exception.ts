import { HttpException, HttpStatus } from '@nestjs/common';

export class ExpenseCreateFailedException extends HttpException {
  constructor() {
    super(
      'Failed to create expense. Please try again later.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
