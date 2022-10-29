import { Injectable } from '@nestjs/common';
import { hash } from 'hash';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

export type PartialUser = Omit<User, 'id' | 'refreshToken'>;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(user: Omit<User, 'id' | 'refreshToken'>) {
    const data = {
      ...user,
      cleanUsername: user.username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
      password: await hash(user.password),
      id: String(BigInt(Date.now()) + BigInt(1667073478)),
    };

    await this.prisma.user.create({
      data: {
        ...user,
        password: await hash(user.password),
        id: String(BigInt(Date.now()) + BigInt(1667073478)),
      },
    });

    return { ...data, password: null };
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: {
        cleanUsername: username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
      },
    });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, data: Partial<User>) {
    this.prisma.user.update({
      where: {
        id: id,
      },
      data: data,
    });
  }
}
