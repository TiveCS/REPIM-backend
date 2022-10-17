import { UsersService } from './../users/users.service';
import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { SignInAuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async signIn(dto: SignInAuthDto) {
    const { email, password } = dto;

    const { id, password: hashedPassword } = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!this.verifyPassword(password, hashedPassword))
      throw new ForbiddenException('Invalid credentials');

    return {
      id,
      message: 'Successfully signed in',
    };
  }

  async verifyPassword(password: string, hashedPassword: string) {
    return argon2.verify(hashedPassword, password);
  }
}
