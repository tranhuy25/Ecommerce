import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TrangThaiPhieuXuat } from 'src/common/constants';

export class CreatePhieuXuatDaiLyDto {
  @IsString()
  @IsOptional()
  maDaiLy?: string;

  @IsString()
  @ApiProperty({ description: 'Mã Phiếu Xuất' })
  maPhieuXuat: string;

  @IsOptional()
  @IsEnum(TrangThaiPhieuXuat)
  status?: TrangThaiPhieuXuat;
}
