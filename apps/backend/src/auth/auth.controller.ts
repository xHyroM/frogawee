import {
  Controller,
  Request,
  Post,
  Get,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body) {
    return this.authService.register({
      username: body.username,
      password: body.password,
    });
  }

  @Post('login')
  async login(@Body() body) {
    return this.authService.login({
      username: body.username,
      password: body.password,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refresh(@Request() req) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    console.log(userId, refreshToken);
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
