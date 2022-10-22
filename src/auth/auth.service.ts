import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from './../prisma/prisma.service';
import { UsersService } from './../users/users.service';
import { SignInAuthDto, SignUpAuthDto } from './dto';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(dto: SignUpAuthDto): Promise<Tokens> {
    const { fullname, email, password } = dto;

    const hashedPassword = await argon2.hash(password);

    try {
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

      const tokens = await this.signTokens(user.id, email);

      await this.updateRefreshToken(user.id, tokens.refresh_token);

      return tokens;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      return error;
    }
  }

  async signIn(dto: SignInAuthDto): Promise<Tokens> {
    const { email, password } = dto;

    const { id, password: hashedPassword } =
      await this.usersService.getUserByEmail(email);

    const isVerified = await this.verifyPassword(password, hashedPassword);
    if (!isVerified) throw new ForbiddenException('Invalid credentials');

    const tokens = await this.signTokens(id, email);

    await this.updateRefreshToken(id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        refreshToken: {
          not: null,
        },
      },
      data: {
        refreshToken: null,
      },
    });
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new ForbiddenException('Access denied');

    const isVerified = await argon2.verify(user.refreshToken, refreshToken);

    if (!isVerified) throw new ForbiddenException('Access denied');

    const tokens = await this.signTokens(userId, user.email);

    await this.updateRefreshToken(userId, tokens.refresh_token);

    return tokens;
  }

  async verifyPassword(password: string, hashedPassword: string) {
    return argon2.verify(hashedPassword, password);
  }

  async signTokens(userId: number, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      await this.jwt.signAsync(
        {
          sub: userId,
          email,
        },
        {
          expiresIn: '15m',
          secret: this.config.get('JWT_SECRET'),
        },
      ),
      await this.jwt.signAsync(
        {
          sub: userId,
          email,
        },
        {
          expiresIn: '7d',
          secret: this.config.get('JWT_REFRESH_SECRET'),
        },
      ),
    ]);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashRt = await argon2.hash(refreshToken);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashRt,
      },
    });
  }
}
