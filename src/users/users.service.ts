import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;

    // 이메일 중복 체크
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    // 비밀번호 해시화 (bcryptjs 사용)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 새 사용자 생성
    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    // 사용자 저장
    const savedUser = await this.usersRepository.save(newUser);

    // 비밀번호를 제외한 사용자 정보 반환
    const { password: _, ...result } = savedUser;
    return result;
  }

  findAll() {
    return this.usersRepository.find({
      select: ['id', 'email', 'name', 'createdAt', 'updatedAt'],
    });
  }

  findOne(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email', 'name', 'createdAt', 'updatedAt'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    await this.usersRepository.remove(user);
    return { message: '사용자가 삭제되었습니다.' };
  }
}
