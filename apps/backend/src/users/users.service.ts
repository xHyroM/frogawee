import { Injectable } from '@nestjs/common';

export interface User {
  userId: number;
  username: string;
  password: string;
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async register(user: Omit<User, 'userId'>) {
    this.users.push({
      ...user,
      userId: this.users.length + 1,
    });
  }
}
