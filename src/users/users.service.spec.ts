import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    name: '홍길동',
    createdAt: new Date('2025-03-25T06:14:56.151Z'),
    updatedAt: new Date('2025-03-25T06:14:56.151Z'),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      name: '홍길동',
    };

    it('should create a new user', async () => {
      const { password: _, ...userWithoutPassword } = mockUser;
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(userWithoutPassword);
    });

    it('should throw ConflictException if email exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        '이미 존재하는 이메일입니다.',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const { password: _, ...userWithoutPassword } = mockUser;
      mockRepository.find.mockResolvedValue([userWithoutPassword]);

      const result = await service.findAll();

      expect(result).toEqual([userWithoutPassword]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const { password: _, ...userWithoutPassword } = mockUser;
      mockRepository.findOne.mockResolvedValue(userWithoutPassword);

      const result = await service.findOne(1);

      expect(result).toEqual(userWithoutPassword);
    });

    it('should return null when user is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updateUserDto = {
      name: '김철수',
    };

    it('should update user successfully', async () => {
      const { password: _, ...userWithoutPassword } = mockUser;
      mockRepository.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(userWithoutPassword);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, updateUserDto);

      expect(result).toEqual(userWithoutPassword);
    });

    it('should throw error when user is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateUserDto)).rejects.toThrow(
        '사용자를 찾을 수 없습니다.',
      );
    });
  });

  describe('remove', () => {
    it('should delete user successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.remove.mockResolvedValue(mockUser);

      const result = await service.remove(1);

      expect(result).toEqual({ message: '사용자가 삭제되었습니다.' });
    });

    it('should throw error when user is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        '사용자를 찾을 수 없습니다.',
      );
    });
  });
});
