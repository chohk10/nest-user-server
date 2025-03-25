import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({
    example: 1,
    description: '사용자 ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: '사용자 이메일',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: 'hashedPassword',
    description: '해시화된 비밀번호',
  })
  @Column()
  password: string;

  @ApiProperty({
    example: '홍길동',
    description: '사용자 이름',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: '2024-03-14T12:00:00Z',
    description: '계정 생성일',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-14T12:00:00Z',
    description: '계정 수정일',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
