import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OwnerGuard } from '../auth/guards/owner.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '회원가입',
    description: '새로운 사용자를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: User,
  })
  @ApiResponse({
    status: 409,
    description: '이미 존재하는 이메일',
  })
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '사용자 목록 조회',
    description: '모든 사용자 목록을 조회합니다. (인증 필요)',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 목록 조회 성공',
    type: [User],
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '사용자 조회',
    description: '특정 사용자의 정보를 조회합니다. (본인만 가능)',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '사용자 ID',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 조회 성공',
    type: User,
  })
  @ApiResponse({
    status: 403,
    description: '권한 없음',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '사용자 정보 수정',
    description: '특정 사용자의 정보를 수정합니다. (본인만 가능)',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '사용자 ID',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 수정 성공',
    type: User,
  })
  @ApiResponse({
    status: 403,
    description: '권한 없음',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '사용자 삭제',
    description: '특정 사용자를 삭제합니다. (본인만 가능)',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '사용자 ID',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 삭제 성공',
  })
  @ApiResponse({
    status: 403,
    description: '권한 없음',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
