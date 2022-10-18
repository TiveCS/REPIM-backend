import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from './../prisma/prisma.service';
import { UsersService } from './../users/users.service';
import { SignInAuthDto, SignUpAuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
    private jwt: JwtService,
  ) {}

  async signUp(dto: SignUpAuthDto) {
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

  async signIn(dto: SignInAuthDto) {
    const { email, password } = dto;

    const { id, password: hashedPassword } =
      await this.usersService.getUserByEmail(email);

    const isVerified = await this.verifyPassword(password, hashedPassword);
    if (!isVerified) throw new ForbiddenException('Invalid credentials');

    const tokens = await this.generateTokens(id);

    return {
      id,
      ...tokens,
    };
  }

  async verifyPassword(password: string, hashedPassword: string) {
    return argon2.verify(hashedPassword, password);
  }

  async generateTokens(userId: number) {
    const access_token = await this.jwt.signAsync({
      sub: userId,
    });
    return { access_token };
  }
}
