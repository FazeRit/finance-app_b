import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  ParseIntPipe,
  Get,
  Req,
  Redirect,
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
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { userId } = await this.authService.validateRefreshToken(
      req.cookies.refreshToken,
    );

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
    status: 302,
    description: 'Redirects to frontend home page after Google authentication',
    schema: { type: 'string', format: 'uri' },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Google authentication failed',
  })
  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  @Redirect('http://localhost:3001/', 302)
  async googleCallback(
    @Req() req: Request & { user: Profile },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken } = await this.authService.externalAuth(
      req.user.email,
    );
    await this.setRefreshCookie(refreshToken, res);
  }
}
