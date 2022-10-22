import { Controller, Get } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  async getUserProfile(@GetUser('id') userId: number) {
    return this.usersService.getUserProfile(userId);
  }
}
