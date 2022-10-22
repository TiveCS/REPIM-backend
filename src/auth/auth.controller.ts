import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser, GetUserId, Public } from './decorator';
import { SignInAuthDto, SignUpAuthDto } from './dto';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { JwtAuthGuard } from './guard/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  async signUp(@Body() dto: SignUpAuthDto) {
    return this.authService.signUp(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async signIn(@Body() dto: SignInAuthDto) {
    return this.authService.signIn(dto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(@GetUser('id') userId: number) {
    return this.authService.logout(userId);
  }

  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refreshToken(
    @GetUser('refreshToken') refreshToken: string,
    @GetUserId() userId: number,
  ) {
    return this.authService.refreshToken(userId, refreshToken);
  }
}
