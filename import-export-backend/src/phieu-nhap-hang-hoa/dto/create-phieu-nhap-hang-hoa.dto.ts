import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePhieuNhapHangHoaDto {
  @IsString()
  @IsOptional()
  maPhieuNhap?: string;

  @ApiProperty({
    description: 'Mã Hàng Hóa',
  })
  @IsString()
  @IsOptional()
  maHangHoa: string;
}
