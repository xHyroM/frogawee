import { PartialUser, User, UsersService } from '../users/users.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, hash } from 'hash';
import { generate } from 'tokens';
import constants from './constants';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(user: PartialUser) {
    const exist = await this.usersService.findByUsername(user.username);
    if (exist)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    const newUser = await this.usersService.create(user);

    const token = await this.getToken(newUser);
    (await this.usersService.findById(newUser.id)).token = await hash(token);

    return {
      accessToken: token,
    };
  }

  async login(data: PartialUser) {
    const user = await this.usersService.findByUsername(data.username);

    if (!user)
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);

    const passwordMatches = await compare(data.password, user.password);

    if (!passwordMatches)
      throw new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);

    const token = await this.getToken(user);
    user.token = await hash(token);

    return {
      accessToken: token,
    };
  }

  async validateToken(token: string) {
    const cleanToken = token.replace('Bearer ', '');
    const userId = Buffer.from(cleanToken, 'base64').toString();
    if (!userId) return false;

    const header = await this.usersService.findById(userId);

    return (await compare(cleanToken, header?.token ?? '')) ? header : null;
  }

  async getToken(user: User) {
    return user.token ?? (await generate(user.id, constants.secret));
  }
}
