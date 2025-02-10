import { HttpException, HttpStatus } from '@nestjs/common';

export class UserCreationFailedException extends HttpException {
  constructor() {
    super(
      'An error occurred while creating the user. Please try again later.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
