import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateDaiLyDto } from './dto/create-dai-ly.dto';
import { DaiLy } from './model/dai-ly-model';
import { UpdateDaiLyDto } from './dto/update-dai-ly-body';
import { PhieuXuatDaiLy } from 'src/phieu-xuat-dai-ly/model/phieu-xuat-dai-ly.model';
import { PhieuXuat } from 'src/phieu-xuat/model/phieu-xuat-model';
import { TrangThaiPhieuXuat } from 'src/common/constants';

@Injectable()
export class DaiLyService {
  constructor(
    @InjectModel(DaiLy)
    private readonly daiLyModel: typeof DaiLy,
    @InjectModel(PhieuXuatDaiLy)
    private readonly phieuXuatDaiLyModel: typeof PhieuXuatDaiLy,
    @InjectModel(PhieuXuat)
    private readonly phieuXuatModel: typeof PhieuXuat,
  ) {}

  // Tìm đại lý theo tên (có chứa chuỗi tìm kiếm)
  async searchDaiLy(ten: string): Promise<DaiLy[]> {
    return this.daiLyModel.findAll({
      where: { ten: { [Op.like]: `%${ten}%` } },
    });
  }

  // Tìm đại lý theo id
  async findById(id: string): Promise<DaiLy> {
    return this.daiLyModel.findOne({ where: { id } });
  }

  async findByMa(ma: string): Promise<DaiLy> {
    const daiLy = await this.daiLyModel.findOne({
      where: { ma },
    });

    if (!daiLy) {
      throw new NotFoundException(`Không tìm thấy đại lý với mã ${ma}`);
    }

    return daiLy;
  }

  // Lấy danh sách tất cả các đại lý
  async findAll(): Promise<DaiLy[]> {
    return this.daiLyModel.findAll();
  }

  // Thêm mới đại lý
  async createDaiLy(data: CreateDaiLyDto): Promise<DaiLy> {
    return this.daiLyModel.create(data);
  }

  // Cập nhật thông tin đại lý
  async updateDaiLy(
    id: string,
    updateData: UpdateDaiLyDto,
  ): Promise<[number, DaiLy[]]> {
    return this.daiLyModel.update(updateData, {
      where: { id },
      returning: true,
    });
  }

  // Xóa đại lý theo id
  async deleteDaiLy(id: string): Promise<void> {
    const daiLy = await this.findById(id);
    if (daiLy) {
      await daiLy.destroy();
    }
  }

  async findDaiLyByMa(ma: string): Promise<DaiLy> {
    const hangHoa = await this.daiLyModel.findOne({
      where: { ma },
    });

    if (!hangHoa) {
      throw new NotFoundException(`Không tìm thấy đại lý với mã ${ma}`);
    }

    return hangHoa;
  }

  async addDaiLyToPhieuXuast(createDaiLyDto: CreateDaiLyDto): Promise<DaiLy> {
    const { danhSachPhieuXuat } = createDaiLyDto;

    // Check if all PhieuXuat exist
    if (danhSachPhieuXuat && danhSachPhieuXuat.length > 0) {
      for (const phieuXuat of danhSachPhieuXuat) {
        const existingPhieuXuat = await this.phieuXuatModel.findOne({
          where: { ma: phieuXuat.maPhieuXuat }, // Check if the PhieuXuat exists
        });

        // If the PhieuXuat does not exist, throw a NotFoundException
        if (!existingPhieuXuat) {
          throw new NotFoundException(
            `Mã Phiếu Xuất : ${phieuXuat.maPhieuXuat} Không tồn tại trong csdl.`,
          );
        }
      }
    }

    // Create the DaiLy (Agent)
    const daiLy = await this.daiLyModel.create(createDaiLyDto);

    // If there are associated PhieuXuatDaiLy records, create them as well
    if (danhSachPhieuXuat && danhSachPhieuXuat.length > 0) {
      const phieuXuatDaiLyData = danhSachPhieuXuat.map((dto) => ({
        ...dto,
        maDaiLy: daiLy.ma,
        status: TrangThaiPhieuXuat.DANG_CHO,
      }));
      await this.phieuXuatDaiLyModel.bulkCreate(phieuXuatDaiLyData);
    }

    return daiLy;
  }
}
