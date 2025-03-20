import { Module } from '@nestjs/common';
import { BillNhapController } from './bill-nhap.controller';
import { BillNhapService } from './bill-nhap.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BillNhap } from './model/bill-nhap-model';

@Module({
  imports: [SequelizeModule.forFeature([BillNhap])],
  controllers: [BillNhapController],
  providers: [BillNhapService],
  exports: [BillNhapService],
})
export class BillNhapModule {}
