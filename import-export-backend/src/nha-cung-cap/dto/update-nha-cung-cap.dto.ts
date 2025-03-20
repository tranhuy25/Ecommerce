import { IsString, IsOptional } from 'class-validator';

export class UpdateNhaCungCapDto {
  @IsString()
  @IsOptional()
  ma?: string;

  @IsString()
  @IsOptional()
  ten?: string;

  @IsString()
  @IsOptional()
  diaChi?: string;

  @IsString()
  @IsOptional()
  soDienThoai?: string;
}
