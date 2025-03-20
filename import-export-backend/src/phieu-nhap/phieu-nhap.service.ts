import { Injectable } from '@nestjs/common';
import { PhieuNhap } from './model/phieu-nhap-model';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePhieuNhapDto } from './dto/create-phieu-nhap.dto';

@Injectable()
export class PhieuNhapService {
  constructor(
    @InjectModel(PhieuNhap) private phieuNhapRepository: typeof PhieuNhap,
  ) {}

  async createPhieuNhap(
    createPhieuNhapDto: CreatePhieuNhapDto,
  ): Promise<PhieuNhap> {
    return await this.phieuNhapRepository.create(createPhieuNhapDto);
  }
  async findAll(): Promise<PhieuNhap[]> {
    return await this.phieuNhapRepository.findAll();
  }

  async findOne(id: string): Promise<PhieuNhap> {
    return await this.phieuNhapRepository.findOne({
      where: {
        id,
      },
    });
  }

  async deletePhieuXuat(id: string): Promise<void> {
    const PhieuXuat = await this.phieuNhapRepository.findByPk(id);
    await PhieuXuat.destroy();
  }
}
