import { IsOptional, IsString } from 'class-validator';

export class UpdateSpecificationDto {
  @IsOptional()
  @IsString()
  product_name?: string;

  @IsOptional()
  screen?: Record<string, any>;

  @IsOptional()
  camera_rear?: Record<string, any>;

  @IsOptional()
  camera_front?: Record<string, any>;

  @IsOptional()
  battery?: Record<string, any>;
}
