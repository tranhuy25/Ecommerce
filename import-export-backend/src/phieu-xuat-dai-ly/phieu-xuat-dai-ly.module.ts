import { Module } from '@nestjs/common';
import { PhieuXuatDaiLyController } from './phieu-xuat-dai-ly.controller';
import { PhieuXuatDaiLyService } from './phieu-xuat-dai-ly.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PhieuXuatDaiLy } from './model/phieu-xuat-dai-ly.model';

@Module({
  imports: [SequelizeModule.forFeature([PhieuXuatDaiLy])],
  controllers: [PhieuXuatDaiLyController],
  providers: [PhieuXuatDaiLyService],
})
export class PhieuXuatDaiLyModule {}
