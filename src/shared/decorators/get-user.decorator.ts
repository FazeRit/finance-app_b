import { User } from '@prisma/client';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

export const CurrentUser = createParamDecorator(
  (key: keyof User, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();

    return key ? req.user[key] : req.user;
  },
);
