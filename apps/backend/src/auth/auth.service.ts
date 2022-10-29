import { PartialUser, UsersService } from '../users/users.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'hash';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(user: PartialUser) {
    const exist = await this.usersService.findByUsername(user.username);
    if (exist)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    const newUser = await this.usersService.create(user);

    const tokens = await this.getTokens(newUser.id, newUser.username);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async login(data: PartialUser) {
    const user = await this.usersService.findByUsername(data.username);

    if (!user)
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);

    const passwordMatches = await compare(data.password, user.password);

    if (!passwordMatches)
      throw new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    this.usersService.update(userId, { refreshToken: null });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);

    const refreshTokenMatches = await compare(refreshToken, user.refreshToken);

    if (!refreshTokenMatches)
      throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await hash(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: jwtConstants.accessSecret,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: jwtConstants.refreshSecret,
          expiresIn: '7d',
        },
      ),
    ]);
    console.log(userId, username, accessToken, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}
