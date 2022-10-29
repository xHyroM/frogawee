import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'hash';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: User) {
    const exist = await this.usersService.findOne(user.username);
    if (exist)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    this.usersService.register({
      username: user.username,
      password: await hash(user.password),
    });
    throw new HttpException('User created', HttpStatus.CREATED);
  }
}
