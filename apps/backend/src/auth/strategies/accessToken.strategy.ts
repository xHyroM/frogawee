import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'custom') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(request: Request) {
    const token =
      request.headers['authorization'] ?? request.headers['Authorization'];

    const payload = await this.authService.validateToken(token ?? '');
    if (!payload) throw new UnauthorizedException();

    const payloadDeepCopy = { ...payload };
    delete payloadDeepCopy['token'];
    return payloadDeepCopy;
  }
}
