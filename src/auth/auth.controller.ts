import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAuthDto, SignUpAuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() dto: SignUpAuthDto) {
    return this.authService.signUp(dto);
  }

  @Post('/signin')
  async signIn(@Body() dto: SignInAuthDto) {
    return this.authService.signIn(dto);
  }
}
