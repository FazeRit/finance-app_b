import { HttpException, HttpStatus } from '@nestjs/common';

export class TokensCreatiomFailedException extends HttpException {
  constructor(message = 'Failed to generate tokens') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
