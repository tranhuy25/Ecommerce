import { Module, forwardRef } from '@nestjs/common';
import { BillXuatService } from './bill-xuat.service';
import { BillXuatController } from './bill-xuat.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { BillXuat } from './model/bill-xuat-model';
import { HangHoa } from 'src/hang-hoa/model/hang-hoa.model';
import { PhieuXuat } from 'src/phieu-xuat/model/phieu-xuat-model';
import { HangHoaModule } from 'src/hang-hoa/hang-hoa.module';
import { PhieuXuatModule } from 'src/phieu-xuat/phieu-xuat.module';

@Module({
  imports: [
    SequelizeModule.forFeature([PhieuXuat]),
    SequelizeModule.forFeature([HangHoa]),
    SequelizeModule.forFeature([BillXuat]),
    HangHoaModule,
    forwardRef(() => PhieuXuatModule),
  ],
  controllers: [BillXuatController],
  providers: [BillXuatService],
  exports: [BillXuatService, SequelizeModule],
})
export class BillXuatModule {}
