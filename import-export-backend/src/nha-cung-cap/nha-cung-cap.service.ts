import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { NhaCungCap } from './model/nha-cung-cap.model';
import { CreateNhaCungCapDto } from './dto/create-nha-cung-cap.dto';
import { UpdateNhaCungCapDto } from './dto/update-nha-cung-cap.dto';

@Injectable()
export class NhaCungCapService {
  constructor(
    @InjectModel(NhaCungCap)
    private readonly nhaCungCapModel: typeof NhaCungCap,
  ) {}

  // Tìm nhà cung cấp theo tên (có chứa chuỗi tìm kiếm)
  async searchNhaCungCap(ten: string): Promise<NhaCungCap[]> {
    return this.nhaCungCapModel.findAll({
      where: { ten: { [Op.like]: `%${ten}%` } },
    });
  }

  // Tìm nhà cung cấp theo id
  async findById(id: string): Promise<NhaCungCap> {
    return this.nhaCungCapModel.findOne({ where: { id } });
  }

  // Lấy danh sách tất cả các nhà cung cấp
  async findAll(): Promise<NhaCungCap[]> {
    return this.nhaCungCapModel.findAll();
  }

  // Thêm mới nhà cung cấp
  async createNhaCungCap(data: CreateNhaCungCapDto): Promise<NhaCungCap> {
    return this.nhaCungCapModel.create(data);
  }

  // Cập nhật thông tin nhà cung cấp
  async updateNhaCungCap(
    id: string,
    updateData: UpdateNhaCungCapDto,
  ): Promise<[number, NhaCungCap[]]> {
    return this.nhaCungCapModel.update(updateData, {
      where: { id },
      returning: true,
    });
  }

  // Xóa nhà cung cấp theo id
  async deleteNhaCungCap(id: string): Promise<void> {
    const nhaCungCap = await this.findById(id);
    if (nhaCungCap) {
      await nhaCungCap.destroy();
    }
  }
  async findByMa(ma: string): Promise<NhaCungCap> {
    const hangHoa = await this.nhaCungCapModel.findOne({
      where: { ma },
    });

    if (!hangHoa) {
      throw new NotFoundException(`Không tìm thấy hàng hóa với mã ${ma}`);
    }

    return hangHoa;
  }
}
