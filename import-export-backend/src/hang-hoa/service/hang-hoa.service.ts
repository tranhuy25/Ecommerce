import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HangHoa } from '../model/hang-hoa.model';
import { CreateHangHoaDto } from '../dto/create-hang-hoa-body';
import { UpdateHangHoaDto } from '../dto/update-hang-hoa-dto';

@Injectable()
export class HangHoaService {
  constructor(
    @InjectModel(HangHoa)
    private readonly hangHoaModel: typeof HangHoa,
  ) {}

  async createHangHoa(createHangHoaDto: CreateHangHoaDto): Promise<HangHoa> {
    return this.hangHoaModel.create(createHangHoaDto);
  }

  async findAll(): Promise<HangHoa[]> {
    return this.hangHoaModel.findAll();
  }

  async findOne(id: string): Promise<HangHoa> {
    return this.hangHoaModel.findOne({ where: { id } });
  }

  async updateHangHoa(ma: string, data: UpdateHangHoaDto): Promise<HangHoa> {
    const hangHoa = await this.findHangHoaByMa(ma);

    if (!hangHoa) {
      throw new Error(`HangHoa with ma "${ma}" not found`);
    }
    await hangHoa.update({ ...data });

    await hangHoa.reload();

    return hangHoa;
  }

  async deleteHangHoa(id: string): Promise<void> {
    const hangHoa = await this.findOne(id);
    await hangHoa.destroy();
  }

  async findHangHoaByMa(ma: string): Promise<HangHoa> {
    const hangHoa = await this.hangHoaModel.findOne({
      where: { ma },
    });

    if (!hangHoa) {
      throw new NotFoundException(`Không tìm thấy hàng hóa với mã ${ma}`);
    }

    return hangHoa;
  }
  // tìm kiếm thông tin hàng hóa theo mã đại lý
  async findHangHoaByMaDaiLy(maDaiLy: string): Promise<HangHoa> {
    const hangHoa = await this.hangHoaModel.findOne({
      where: { maDaiLy },
    });

    if (!hangHoa) {
      throw new NotFoundException(`Không tìm thấy hàng hóa với mã ${maDaiLy}`);
    }

    return hangHoa;
  }
}
