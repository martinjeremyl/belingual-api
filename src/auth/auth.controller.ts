import {
  Controller,
  Request,
  Get,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() user: User): Promise<{ access_token: string }> {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req): User {
    return req.user;
  }

  @Post('register')
  async register(@Body() user: User): Promise<User> {
    return this.authService.register(user);
  }
}
