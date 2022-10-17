import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signIn(@Body() dto: SignInAuthDto) {
    return this.authService.signIn(dto);
  }
}
