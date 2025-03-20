import { Module } from '@nestjs/common';
import { NhaCungCapController } from './nha-cung-cap.controller';
import { NhaCungCapService } from './nha-cung-cap.service';
import { NhaCungCap } from './model/nha-cung-cap.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([NhaCungCap])],
  controllers: [NhaCungCapController],
  providers: [NhaCungCapService],
})
export class NhaCungCapModule {}
