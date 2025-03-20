// src/auth/dto/create-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Tên Đăng Nhập',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Mật Khẩu Người Dùng',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
