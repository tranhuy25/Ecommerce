import { Module } from '@nestjs/common';
import { PhieuNhapController } from './phieu-nhap.controller';
import { PhieuNhapService } from './phieu-nhap.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PhieuNhap } from './model/phieu-nhap-model';

@Module({
  imports: [SequelizeModule.forFeature([PhieuNhap])],
  controllers: [PhieuNhapController],
  providers: [PhieuNhapService],
  exports: [PhieuNhapService],
})
export class PhieuNhapModule {}
