import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: User) {
    const existingUser = await this.usersService.findOne(user.email);
    if (existingUser instanceof User) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    } else {
      await this.usersService.register(user);
      return user;
    }
  }

  googleLogin(req) {
    if (!req.user) {
      throw new HttpException('No user found', HttpStatus.BAD_REQUEST);
    }

    return req.user.accessToken;
  }
}
