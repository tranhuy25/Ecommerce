import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsDecimal,
  IsOptional,
} from 'class-validator';

export class CreateBillNhaptDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  maPhieuNhap: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  maHangHoa: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  productName: string;

  @IsInt()
  @IsOptional()
  quantity: number;

  @IsDecimal()
  @IsOptional()
  unitPrice: number;

  @IsOptional()
  @IsDecimal()
  totalPrice?: number;
}
