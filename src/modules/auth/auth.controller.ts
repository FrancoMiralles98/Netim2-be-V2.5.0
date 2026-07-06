import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { AppConfigType } from 'src/config/types/app-config.type';
import { NodeEnv } from 'src/config/types/node-env.enum';
import { Response } from 'express';
import { CookieNames } from './types/cookie-names.enum';
import { ReqCookies } from './decorator/cookie.decorator';
import { Throttle } from '@nestjs/throttler';
import { LOGIN_THROTTLER } from 'src/config/throttlers';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService<AppConfigType>
  ) { }

  @Throttle({ default: LOGIN_THROTTLER })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { username: string, password: string }, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, userData } = await this.authService.login(body.username, body.password)
    res.cookie(CookieNames.ACCESS_TOKEN, accessToken, this.getAccessCookieOptions())
    res.cookie(CookieNames.REFRESH_TOKEN, refreshToken, this.getRefreshCookieOptions())
    return { userData }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @ReqCookies(CookieNames.REFRESH_TOKEN) refreshToken: string | undefined,
    @Res({ passthrough: true }) res: Response
  ) {
    const newAccessToken = await this.authService.refresh(refreshToken)
    res.cookie(CookieNames.ACCESS_TOKEN, newAccessToken, this.getAccessCookieOptions())
    return { ok: true }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    try {
      await this.authService.logout()
      return { ok: true }
    } catch (error) {

    } finally {
      res.clearCookie(CookieNames.ACCESS_TOKEN)
      res.clearCookie(CookieNames.REFRESH_TOKEN)
    }
  }

  private getAccessCookieOptions() {
    const isProd = this.config.get('app', { infer: true })?.node_env === NodeEnv.PRODUCTION;

    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? ('none' as const) : ('lax' as const),
      path: '/',
      maxAge: this.config.getOrThrow('auth', { infer: true }).jwt_access_cookie_max_age,
    };
  }

  private getRefreshCookieOptions() {
    const isProd = this.config.get('app', { infer: true })?.node_env === NodeEnv.PRODUCTION;

    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? ('none' as const) : ('lax' as const),
      path: '/',
      maxAge: this.config.getOrThrow('auth', { infer: true }).jwt_refresh_cookie_max_age,
    };
  }
}
