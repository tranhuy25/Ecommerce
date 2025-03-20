// create-phieu-nhap.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { CreatePhieuNhapHangHoaDto } from 'src/phieu-nhap-hang-hoa/dto/create-phieu-nhap-hang-hoa.dto';

export class CreatePhieuNhapDto {
  @IsString()
  @ApiProperty({
    description: 'Mã Phiếu Nhap',
    required: true,
  })
  ma: string;

  // tổng số tiền
  @IsString()
  @ApiProperty({
    description: 'Total amount of the Phieu Xuat',
    required: true,
  })
  totalAmount: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePhieuNhapHangHoaDto)
  @ApiProperty({ type: [CreatePhieuNhapHangHoaDto] })
  danhSachHangHoa: CreatePhieuNhapHangHoaDto[];

  @IsString()
  @ApiProperty({
    description: 'Số Lượng',
  })
  soLuong: number;
}
