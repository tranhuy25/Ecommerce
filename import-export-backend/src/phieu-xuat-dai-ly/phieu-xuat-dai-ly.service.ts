import { Injectable } from '@nestjs/common';
import { PhieuXuatDaiLy } from './model/phieu-xuat-dai-ly.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PhieuXuatDaiLyService {
  constructor(
    @InjectModel(PhieuXuatDaiLy)
    private phieuXuatDaiLyRepository: typeof PhieuXuatDaiLy,
  ) {}

  async findAll(): Promise<PhieuXuatDaiLy[]> {
    return this.phieuXuatDaiLyRepository.findAll();
  }
}
