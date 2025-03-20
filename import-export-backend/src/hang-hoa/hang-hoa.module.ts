import { Module } from '@nestjs/common';
import { HangHoaController } from './controllers/hang-hoa.controller';
import { HangHoaService } from './service/hang-hoa.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { HangHoa } from './model/hang-hoa.model';

@Module({
  imports: [SequelizeModule.forFeature([HangHoa])],
  providers: [HangHoaService],
  controllers: [HangHoaController],
  exports: [HangHoaService],
})
export class HangHoaModule {}
