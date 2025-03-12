import { Strategy } from 'passport-twitter';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor(private config: ConfigService) {
    super({
      consumerKey: config.getOrThrow('TWITTER_API_KEY'),
      consumerSecret: config.getOrThrow('TWITTER_API_SECRET'),
      callbackURL: 'http://www.localhost:3000/auth/twitter/callback',
      includeEmail: true,
    });
  }

  async validate(
    token: string,
    tokenSecret: string,
    profile: any,
    done: (err: any, user: any) => void,
  ): Promise<void> {
    const user = {
      twitterId: profile.id,
      email: profile._json?.email || null,
      username: profile.username || null,
    };

    if (!user.email) {
      return done(
        new UnauthorizedException('No email provided by Twitter'),
        null,
      );
    }

    return done(null, user);
  }
}
