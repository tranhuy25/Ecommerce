import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PhieuXuatHangHoa } from './model/phieu-xuat-hang-hoa.model';

@Injectable()
export class PhieuXuatHangHoaService {
  constructor(
    @InjectModel(PhieuXuatHangHoa)
    private phieuXuatHangHoaRepository: typeof PhieuXuatHangHoa,
  ) {}

  async findAll(): Promise<PhieuXuatHangHoa[]> {
    return this.phieuXuatHangHoaRepository.findAll();
  }
}
