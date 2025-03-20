import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateNhaCungCapDto } from 'src/nha-cung-cap/dto/create-nha-cung-cap.dto';

export class CreatePhieuNhapNhaCungCapDto {
  @ApiProperty({
    description: 'Mã Phiếu Nhập',
  })
  @IsString()
  @IsOptional()
  maPhieuNhap: string;

  @ApiProperty({
    description: 'Mã Nhà Cung Cấp',
  })
  @IsString()
  @IsOptional()
  maNhaCungCap: string;

  @IsOptional()
  nhaCungCapList?: CreateNhaCungCapDto;

  @IsOptional()
  @ApiProperty({
    description: 'Mã',
  })
  ma: string;
}
