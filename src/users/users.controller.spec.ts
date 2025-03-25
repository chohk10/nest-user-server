import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ForbiddenException } from '@nestjs/common';
import { OwnerGuard } from '../auth/guards/owner.guard';
import { ExecutionContext } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let ownerGuard: OwnerGuard;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: '홍길동',
    createdAt: new Date('2025-03-25T06:19:48.934Z'),
    updatedAt: new Date('2025-03-25T06:19:48.934Z'),
  };

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => ({
        user: { id: 2 },
        params: { id: '1' },
      }),
    }),
  } as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        OwnerGuard,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    ownerGuard = module.get<OwnerGuard>(OwnerGuard);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: '홍길동',
      };

      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.signup(createUserDto);

      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUsersService.findAll.mockResolvedValue([mockUser]);

      const result = await controller.findAll();

      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user when user is authorized', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockUser);
    });

    it('should throw ForbiddenException when user is not authorized', () => {
      expect(() => ownerGuard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
      expect(() => ownerGuard.canActivate(mockExecutionContext)).toThrow(
        '자신의 리소스에만 접근할 수 있습니다.',
      );
    });
  });

  describe('update', () => {
    const updateUserDto = {
      name: '김철수',
    };

    it('should update a user when user is authorized', async () => {
      const updatedUser = { ...mockUser, ...updateUserDto };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('1', updateUserDto);

      expect(result).toEqual(updatedUser);
    });

    it('should throw ForbiddenException when user is not authorized', () => {
      expect(() => ownerGuard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
      expect(() => ownerGuard.canActivate(mockExecutionContext)).toThrow(
        '자신의 리소스에만 접근할 수 있습니다.',
      );
    });
  });

  describe('remove', () => {
    it('should remove a user when user is authorized', async () => {
      mockUsersService.remove.mockResolvedValue(true);

      const result = await controller.remove('1');

      expect(result).toBeTruthy();
    });

    it('should throw ForbiddenException when user is not authorized', () => {
      expect(() => ownerGuard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
      expect(() => ownerGuard.canActivate(mockExecutionContext)).toThrow(
        '자신의 리소스에만 접근할 수 있습니다.',
      );
    });
  });
});
