import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePhieuXuatDaiLyDto } from 'src/phieu-xuat-dai-ly/dto/phieu-xuat-dai-ly.dto';
import { Type } from 'class-transformer';

export class CreateDaiLyDto {
  @ApiProperty({
    description: 'UUID của đại lý, được hệ thống tự động tạo',
    example: 'e72e1b94-92a1-4b89-b8b8-d2eb17f3b3e1',
    readOnly: true,
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Mã của đại lý',
    example: 'DL001',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  ma: string;

  @ApiProperty({
    description: 'Tên của đại lý',
    example: 'Đại lý ABC',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  ten: string;

  @ApiProperty({
    description: 'Địa chỉ của đại lý',
    example: '123 Đường ABC, Quận 1, TP. HCM',
    required: false,
  })
  @IsOptional()
  @IsString()
  diaChi?: string;

  @ApiProperty({
    description: 'Số điện thoại của đại lý',
    example: '0909123456',
    required: true,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePhieuXuatDaiLyDto)
  @ApiProperty({ type: [CreatePhieuXuatDaiLyDto] })
  danhSachPhieuXuat: CreatePhieuXuatDaiLyDto[];
}
