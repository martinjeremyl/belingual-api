import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const fakeUser = {
    email: 'fakeEmail@mail.fr',
    password: 'fakePassword',
  } as User;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: () => {
              return { access_token: 'fakeToken' };
            },
            register: () => {
              return fakeUser;
            },
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('/login', () => {
    it('should return an access_token on success', async () => {
      expect(await controller.login(fakeUser)).toStrictEqual({
        access_token: 'fakeToken',
      });
    });
  });

  describe('/register', () => {
    it('should return a user on success', async () => {
      expect(await controller.register(fakeUser)).toStrictEqual(fakeUser);
    });
  });

  describe('/profile', () => {
    it('should return a user on success', () => {
      expect(
        controller.getProfile({
          user: fakeUser,
        }),
      ).toStrictEqual(fakeUser);
    });
  });
});
