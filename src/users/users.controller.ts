import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getUserProfile(@GetUser('id') userId: number) {
    return this.usersService.getUserProfile(userId);
  }
}
