import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  ParseIntPipe,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/index';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/utils/decorators/get-user.decorator';
import { Profile } from 'passport-google-oauth20';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  async setRefreshCookie(refreshToken: string, res: Response) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }

  get isProduction(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }

  @Post('register')
  async register(
    @Body() credentials: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.register(credentials);

    await this.setRefreshCookie(refreshToken, res);

    return { accessToken };
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.generateTokens(userId);

    await this.setRefreshCookie(refreshToken, res);

    return { accessToken };
  }

  @Post('refresh')
  async refresh(
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.generateTokens(userId);

    await this.setRefreshCookie(refreshToken, res);

    return { accessToken };
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');

    return { message: 'Logout successfully' };
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async google() {}

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleCallback(
    @Req() req: Request & { user: Profile },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.googleAuth(
      req.user.email,
    );

    await this.setRefreshCookie(refreshToken, res);

    return { accessToken };
  }
}
