import { HttpException, HttpStatus } from '@nestjs/common';

export class ExpenseUpdateFailedException extends HttpException {
  constructor() {
    super(
      'Failed to update expense. Please try again later.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
