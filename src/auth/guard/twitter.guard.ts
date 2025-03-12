import { AuthGuard } from '@nestjs/passport';

export class TwitterGuard extends AuthGuard('twitter') {}
