import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PhieuXuatService } from './phieu-xuat.service';
import { PhieuXuatController } from './phieu-xuat.controller';
import { PhieuXuatDaiLy } from 'src/phieu-xuat-dai-ly/model/phieu-xuat-dai-ly.model';
import { PhieuXuatHangHoa } from 'src/phieu-xuat-hang-hoa/model/phieu-xuat-hang-hoa.model';
import { PhieuXuatHangHoaService } from 'src/phieu-xuat-hang-hoa/phieu-xuat-hang-hoa.service';
import { PhieuXuat } from './model/phieu-xuat-model';
import { HangHoa } from 'src/hang-hoa/model/hang-hoa.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      PhieuXuat,
      PhieuXuatDaiLy,
      PhieuXuatHangHoa,
      HangHoa,
    ]),
  ],
  controllers: [PhieuXuatController],
  providers: [PhieuXuatService, PhieuXuatHangHoaService],
})
export class PhieuXuatModule {}
