import { Injectable } from '@nestjs/common';
import { hash } from 'hash';

export interface User {
  id: string;
  username: string;
  password: string;
  refreshToken?: string;
}

export type PartialUser = Omit<User, 'id' | 'refreshToken'>;

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  async create(user: Omit<User, 'id' | 'refreshToken'>) {
    const data = {
      ...user,
      password: await hash(user.password),
      id: this.users.length + 1 + '',
    };

    this.users.push(data);

    return { ...data, password: null };
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async update(id: string, data: Partial<User>) {
    const found = await this.findById(id);

    if (data.username) found.username = data.username;
    if (data.password) found.password = await hash(data.password);
    if (data.refreshToken) found.refreshToken = data.refreshToken;
  }
}
