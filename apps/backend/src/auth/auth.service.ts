import { PartialUser, UsersService } from '../users/users.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare } from 'hash';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(user: PartialUser) {
    const exist = await this.usersService.findByUsername(user.username);
    if (exist)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    const newUser = await this.usersService.create(user);

    return {
      accessToken: newUser.token,
    };
  }

  async login(data: Omit<PartialUser, 'email' | 'classId' | 'type'>) {
    const user = await this.usersService.findByUsername(data.username);

    if (!user)
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);

    const passwordMatches = await compare(data.password, user.password);

    if (!passwordMatches)
      throw new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);

    return {
      accessToken: user.token,
    };
  }

  async validateToken(token: string) {
    const userId = Buffer.from(token.split('.')?.[0], 'base64').toString();
    if (!userId) return false;

    const header = await this.usersService.$findById(userId);

    return token === header?.token ? header : null;
  }
}
