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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiProperty,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/index';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/utils/decorators/get-user.decorator';
import { Profile } from 'passport-google-oauth20';

class TokenResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIs...',
  })
  accessToken: string;
}

class LogoutResponseDto {
  @ApiProperty({
    description: 'Logout confirmation message',
    example: 'Logout successfully',
  })
  message: string;
}

@ApiTags('auth')
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

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto, description: 'User registration credentials' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - User already exists',
  })
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

  @ApiOperation({ summary: 'Log in a user with email and password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
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

  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiCookieAuth('refreshToken')
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired refresh token',
  })
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

  @ApiOperation({ summary: 'Log out a user' })
  @ApiBearerAuth('JWT-access')
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
    type: LogoutResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired access token',
  })
  @UseGuards(AuthGuard('jwt-access'))
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');
    return { message: 'Logout successfully' };
  }

  @ApiOperation({ summary: 'Initiate Twitter authentication' })
  @ApiResponse({
    status: 302,
    description: 'Redirects to Twitter login page',
    schema: { type: 'string', format: 'uri' },
  })
  @UseGuards(AuthGuard('twitter'))
  @Get('twitter')
  async twitterLogin() {}

  @ApiOperation({ summary: 'Twitter authentication callback' })
  @ApiResponse({
    status: 200,
    description: 'Twitter authentication successful',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Twitter authentication failed',
  })
  @UseGuards(AuthGuard('twitter'))
  @Get('twitter/callback')
  async twitterCallback(
    @Req()
    req: Request & {
      user: { twitterId: string; email: string; username: string };
    },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.externalAuth(
      req.user.email,
    );

    await this.setRefreshCookie(refreshToken, res);
    return { accessToken };
  }

  @ApiOperation({ summary: 'Initiate Google authentication' })
  @ApiResponse({
    status: 302,
    description: 'Redirects to Google login page',
    schema: { type: 'string', format: 'uri' },
  })
  @UseGuards(AuthGuard('google'))
  @Get('google')
  async google() {}

  @ApiOperation({ summary: 'Google authentication callback' })
  @ApiResponse({
    status: 200,
    description: 'Google authentication successful',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Google authentication failed',
  })
  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleCallback(
    @Req() req: Request & { user: Profile },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.externalAuth(
      req.user.email,
    );

    await this.setRefreshCookie(refreshToken, res);
    return { accessToken };
  }
}
