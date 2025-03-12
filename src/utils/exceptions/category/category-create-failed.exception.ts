import { HttpException, HttpStatus } from '@nestjs/common';

export class CategoryCreateFailed extends HttpException {
  constructor() {
    super(
      'Failed to fetch category. Please try again later.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
