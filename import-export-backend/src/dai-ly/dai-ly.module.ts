import { Module } from '@nestjs/common';
import { DaiLyService } from './dai-ly.service';
import { DaiLyController } from './dai-ly.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { DaiLy } from './model/dai-ly-model';
import { PhieuXuatDaiLy } from 'src/phieu-xuat-dai-ly/model/phieu-xuat-dai-ly.model';
import { PhieuXuat } from 'src/phieu-xuat/model/phieu-xuat-model';

@Module({
  imports: [SequelizeModule.forFeature([DaiLy, PhieuXuatDaiLy, PhieuXuat])],
  providers: [DaiLyService],
  controllers: [DaiLyController],
  exports: [DaiLyService],
})
export class DaiLyModule {}
