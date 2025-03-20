import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNhaCungCapDto {
  @ApiProperty({
    description: 'Mã nhà cung cấp',
    example: 'NCC001',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  ma: string;

  @ApiProperty({
    description: 'Tên nhà cung cấp',
    example: 'Công ty TNHH ABC',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  ten: string;

  @ApiProperty({
    description: 'Địa chỉ nhà cung cấp',
    example: '123 Đường ABC, Thành phố XYZ',
    required: true,
  })
  @IsString()
  diaChi?: string;

  @ApiProperty({
    description: 'Số điện thoại nhà cung cấp',
    example: '0123456789',
    required: true,
  })
  @IsString()
  soDienThoai?: string;
}
