import { HttpException, HttpStatus } from '@nestjs/common';

export class CategoryAlreadyExistsException extends HttpException {
  constructor() {
    super('Category with this name already exists', HttpStatus.CONFLICT);
  }
}
