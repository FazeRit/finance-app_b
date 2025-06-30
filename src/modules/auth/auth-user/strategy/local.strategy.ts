import { AuthFacadeService } from '../services/auth-facade/auth-facade.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authFacadeService: AuthFacadeService) {
    super({
      usernameField: 'email',
    })
  }

  async validate(email: string, password: string) {
    const response = await this.authFacadeService.validateUser(email, password);
    const user = response.data;
    
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
