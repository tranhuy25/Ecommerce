import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PhieuNhapNhaCungCap } from './model/phieu-nhap-nha-cung-cap.model';
import { PhieuNhapNhaCungCapController } from './phieu-nhap-nha-cung-cap.controller';
import { PhieuNhapNhaCungCapService } from './phieu-nhap-nha-cung-cap.service';

@Module({
  imports: [SequelizeModule.forFeature([PhieuNhapNhaCungCap])],
  controllers: [PhieuNhapNhaCungCapController],
  providers: [PhieuNhapNhaCungCapService],
})
export class PhieuNhapNhaCungCapModule {}
