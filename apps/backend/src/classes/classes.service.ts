import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hash } from 'hash';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { generate as generateToken, timestampToSnowflake } from 'tokens';

export enum UserType {
  'Student' = 'STUDENT',
  'Teacher' = 'TEACHER',
}
export type PartialUser = Omit<User, 'id' | 'token'>;

@Injectable()
export class ClassesService {
  constructor(private prismaService: PrismaService) {}

  async create(user: PartialUser) {
    const id = timestampToSnowflake();

    return this.prismaService.user.create({
      data: {
        username: user.username,
        password: await hash(user.password),
        email: user.email,
        type: UserType.Student,
        id,
        token: await generateToken(id),
      },
    });
  }

  async findAll(): Promise<
    Omit<User, 'username' | 'token' | 'password' | 'email' | 'classId'>[]
  > {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        username: true,
        type: true,
      },
    });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({
      where: {
        username: username,
      },
    });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, data: Partial<User>) {
    delete data['id'];

    const original = await this.findById(id);

    try {
      return await this.prismaService.user.update({
        where: {
          id: id,
        },
        data: {
          ...data,
          password:
            'password' in data ? await hash(data.password) : original.password,
          token:
            'password' in data
              ? await generateToken(original.id)
              : original.token,
        },
        select: {
          id: true,
          username: true,
          type: true,
          token: 'password' in data,
        },
      });
    } catch (e) {
      throw new HttpException(
        e.meta?.target
          ? `This ${e.meta.target.join(', ')} is already used.`
          : e.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
