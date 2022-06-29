import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findOne(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email: email },
    });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async register(user: User): Promise<void> {
    this.usersRepository.save(user);
  }
}
