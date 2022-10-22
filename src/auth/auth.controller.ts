import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/users/decorator';
import { AuthService } from './auth.service';
import { SignInAuthDto, SignUpAuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  async signUp(@Body() dto: SignUpAuthDto) {
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async signIn(@Body() dto: SignInAuthDto) {
    return this.authService.signIn(dto);
  }

  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(@GetUser('id') userId: number) {
    return this.authService.logout(userId);
  }
}
