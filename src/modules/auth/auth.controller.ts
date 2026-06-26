import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { AppConfigType } from 'src/config/types/app-config.type';
import { NodeEnv } from 'src/config/types/node-env.enum';
import { Response } from 'express';
import { CookieNames } from './types/cookie-names.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService<AppConfigType>
  ) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string, password: string }, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(body.email, body.password)
    res.cookie(CookieNames.ACCESS_TOKEN, accessToken, this.getAccessCookieOptions())
    res.cookie(CookieNames.REFRESH_TOKEN, refreshToken, this.getRefreshCookieOptions())
    return { ok: true }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register() {

  }

  private getAccessCookieOptions() {
    const isProd = this.config.get('app', { infer: true })?.node_env === NodeEnv.PRODUCTION;

    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? ('none' as const) : ('lax' as const),
      path: '/',
      maxAge: this.config.getOrThrow('auth',{infer:true}).jwt_access_cookie_max_age,
    };
  }

  private getRefreshCookieOptions() {
    const isProd = this.config.get('app', { infer: true })?.node_env === NodeEnv.PRODUCTION;

    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? ('none' as const) : ('lax' as const),
      path: '/',
      maxAge: this.config.getOrThrow('auth',{infer:true}).jwt_refresh_cookie_max_age,
    };
  }
}
