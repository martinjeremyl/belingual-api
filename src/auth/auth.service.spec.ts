import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { User } from '../entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const fakeUser = {
    email: 'fakeEmail@mail.fr',
    password: 'fakePassword',
  } as User;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: () => fakeUser,
            register: () => of(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: () => 'fakeToken',
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a valid user on success', async () => {
      expect(
        await service.validateUser(fakeUser.email, fakeUser.password),
      ).toStrictEqual({ email: fakeUser.email });
    });

    it('should throw an error on invalid password', async () => {
      const validateUserFunc = service.validateUser(
        fakeUser.email,
        'wrongPassword',
      );
      expect(validateUserFunc).resolves.toThrow();
    });
  });

  describe('login', () => {
    it('should return an access_token on success', async () => {
      expect(await service.login(fakeUser)).toStrictEqual({
        access_token: 'fakeToken',
      });
    });
  });
  describe('register', () => {
    it('should return a valid user on success', async () => {
      const newUser = {
        email: 'newEmail@mail.fr',
        password: 'stillFakepassword',
      } as User;
      expect(await service.register(newUser)).toStrictEqual(newUser);
    });

    it('should throw an error on existing user', async () => {
      expect(service.register(fakeUser)).resolves.toThrow();
    });
  });
});
