import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateHangHoaDto {
  @ApiProperty({
    description: 'Unique for the item',
    example: 'HTML',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  ma: string;

  @ApiProperty({ description: 'Item name', example: 'Laptop', required: true })
  @IsNotEmpty()
  @IsString()
  ten: string;

  @ApiProperty({
    description: 'Item description',
    example: 'High-end gaming laptop',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Quantity in stock',
    example: 1050,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  soLuong: number;

  @ApiProperty({
    description: 'Purchase price of the item',
    example: 15500.0,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  giaNhap: number;
}
