import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body) {
    return this.authService.register({
      username: body.username,
      password: body.password,
      email: body.email,
      type: body.type,
    });
  }

  @Post('login')
  async login(@Body() body) {
    return this.authService.login({
      username: body.username,
      password: body.password,
    });
  }
}
