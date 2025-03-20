import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateHangHoaDto } from 'src/hang-hoa/dto/create-hang-hoa-body';

export class CreatePhieuXuatHangHoaDto {
  @IsString()
  @ApiProperty({ description: 'Mã Hàng Hóa' })
  maHangHoa: string;

  @IsString()
  @IsOptional()
  maPhieuXuat?: string;

  @IsString()
  @ApiProperty({ description: 'Số Lượng', required: true })
  soLuong?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateHangHoaDto)
  @ApiProperty({ type: [CreateHangHoaDto] })
  hangHoaList?: CreateHangHoaDto[];
}
