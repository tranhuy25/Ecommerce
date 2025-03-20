import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PhieuNhapHangHoa } from './model/phieu-nhap-hang-hoa.model';
import { PhieuNhapHangHoaController } from './phieu-nhap-hang-hoa.controller';
import { PhieuNhapHangHoaService } from './phieu-nhap-hang-hoa.service';

@Module({
  imports: [SequelizeModule.forFeature([PhieuNhapHangHoa])],
  controllers: [PhieuNhapHangHoaController],
  providers: [PhieuNhapHangHoaService],
})
export class PhieuNhapHangHoaModule {}
