import {
	ApiBearerAuth,
	ApiBody,
	ApiCookieAuth,
	ApiOperation,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger';
import { AuthFacadeService } from '../../services/auth-facade/auth-facade.service';
import { AuthGuard } from '@nestjs/passport';
import {
	Body,
	Controller,
	Get,
	ParseIntPipe,
	Post,
	Redirect,
	Req,
	Res,
	UseGuards
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from 'src/shared/decorators/get-user.decorator';
import {
	GoogleAuthDoc,
	GoogleCallbackDoc,
	LoginDoc,
	LogoutDoc,
	RefreshDoc,
	RegisterDoc
} from '../../../docs';
import { LogoutResponseDto } from 'src/modules/auth/auth-shared/dto/response/logout-response.dto';
import { Profile } from 'passport-google-oauth20';
import { RegisterDto } from '../../dto/request/register.dto';
import { Request, Response } from 'express';
import { TokenResponseDto } from 'src/modules/auth/auth-shared/dto/response/token-response.dto';
import { User } from '@prisma/client';

@ApiTags('auth')
@Controller('auth')
export class AuthWriteController {
	constructor(
		private facade: AuthFacadeService,
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

	@LoginDoc
	@UseGuards(AuthGuard('local'))
	@Post('login')
	async login(
		@CurrentUser('id', ParseIntPipe) userId: number,
		@Res({ passthrough: true }) res: Response,
	) {
		const response = await this.facade.generateTokens(userId.toString());
		const { accessToken, refreshToken } = response.data;

		await this.setRefreshCookie(refreshToken, res);
		return { accessToken };
	}

	@RegisterDoc
	@Post('register')
	async register(
		@Body() dto: RegisterDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const response = await this.facade.register(dto);
		const { accessToken, refreshToken } = response.data;

		await this.setRefreshCookie(refreshToken, res);

		return { accessToken };
	}

	@LogoutDoc
	@UseGuards(AuthGuard('jwt-access'))
	@Post('logout')
	async logout(@Res({ passthrough: true }) res: Response) {
		res.clearCookie('refreshToken');
		return { message: 'Logout successfully' };
	}

	@GoogleAuthDoc
	@UseGuards(AuthGuard('google'))
	@Get('google')
	async google() {}

	@GoogleCallbackDoc
	@UseGuards(AuthGuard('google'))
	@Get('google/callback')
	@Redirect('http://localhost:3001/', 302)
	async googleCallback(
	@Req() req: Request & { user: Profile },
	@Res({ passthrough: true }) res: Response,
	) {
		const response = await this.facade.externalAuth(req.user.email);
		const { refreshToken } = response.data;

		await this.setRefreshCookie(refreshToken, res);
	}

	@RefreshDoc
	@Post('refresh')
	async refresh(
	@Req() req: Request,
	@Res({ passthrough: true }) res: Response,
	) {
		const response = await this.facade.validateRefreshToken(req.cookies.refreshToken);
		const { userId } = response.data;

		const tokensResponse = await this.facade.generateTokens(userId);
		const { accessToken, refreshToken } = tokensResponse.data;

		await this.setRefreshCookie(refreshToken, res);
		return { accessToken };
	}
}
