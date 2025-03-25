import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
  };

  const mockResponse = {
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should set cookie and return user info', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockLoginResult = {
        access_token: 'mock.jwt.token',
        user: {
          id: 1,
          email: 'test@example.com',
          name: '홍길동',
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResult);

      const result = await controller.login(loginDto, mockResponse);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        mockLoginResult.access_token,
        expect.any(Object),
      );
      expect(result).toEqual({ user: mockLoginResult.user });
    });
  });

  describe('logout', () => {
    it('should clear cookie and return success message', async () => {
      const result = await controller.logout(mockResponse);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith('access_token');
      expect(result).toEqual({ message: '로그아웃되었습니다.' });
    });
  });

  describe('getMe', () => {
    it('should return user information', async () => {
      const mockUser = { id: 1 };
      const mockFullUserInfo = {
        id: 1,
        email: 'test@example.com',
        name: '홍길동',
      };

      mockUsersService.findOne.mockResolvedValue(mockFullUserInfo);

      const result = await controller.getMe(mockUser);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual({ user: mockFullUserInfo });
    });
  });
});
