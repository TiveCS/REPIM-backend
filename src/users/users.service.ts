import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const { fullname, email, password } = dto;

    const hashedPassword = await argon2.hash(password);

    const user = await this.prisma.user.create({
      data: {
        fullname,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    return user;
  }
}
