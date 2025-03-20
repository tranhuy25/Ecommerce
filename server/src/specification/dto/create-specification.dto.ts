import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  ValidateNested,
  IsBoolean,
} from 'class-validator';

class ScreenDto {
  @IsOptional()
  @IsString()
  refresh_rate?: string;

  @IsOptional()
  @IsString()
  technology?: string;

  @IsOptional()
  @IsString()
  resolution?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  brightness?: string;
}

class CameraDto {
  @IsOptional()
  @IsString()
  resolution?: string;

  @IsOptional()
  @IsString({ each: true })
  features?: string[];
}

class BatteryDto {
  @IsOptional()
  @IsString()
  capacity?: string;

  @IsOptional()
  @IsString()
  fast_charge?: string;

  @IsOptional()
  @IsBoolean()
  wireless_charge?: boolean;
}

export class CreateSpecificationDto {
  @IsString()
  product_name: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ScreenDto)
  screen?: ScreenDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CameraDto)
  camera_rear?: CameraDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CameraDto)
  camera_front?: CameraDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BatteryDto)
  battery?: BatteryDto;
}
