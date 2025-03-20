import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HangHoa } from 'src/hang-hoa/model/hang-hoa.model';
import { PhieuXuatHangHoa } from 'src/phieu-xuat-hang-hoa/model/phieu-xuat-hang-hoa.model';
import { PhieuXuat } from './model/phieu-xuat-model';
import { CreatePhieuXuatDto } from './dto/create-phieu-xuat.body.dto';

@Injectable()
export class PhieuXuatService {
  constructor(
    @InjectModel(PhieuXuat) private readonly phieuXuatModel: typeof PhieuXuat,
    @InjectModel(HangHoa) private readonly hangHoaModel: typeof HangHoa,
    @InjectModel(PhieuXuatHangHoa)
    private readonly phieuXuatHangHoaModel: typeof PhieuXuatHangHoa,
  ) {}

  async placeOrder(
    createPhieuXuatDto: CreatePhieuXuatDto,
    maDaiLy: string,
  ): Promise<string> {
    const { ma, danhSachHangHoa } = createPhieuXuatDto;

    // Step 1: Kiểm tra tồn kho và chuẩn bị dữ liệu hàng hóa
    const maHangHoas = danhSachHangHoa.map((item) => item.maHangHoa);
    const hangHoas = await this.hangHoaModel.findAll({
      where: { ma: maHangHoas },
    });

    if (!hangHoas || hangHoas.length !== danhSachHangHoa.length) {
      throw new BadRequestException(
        'Một hoặc nhiều mặt hàng không tồn tại trong kho',
      );
    }

    const hangHoaMap = new Map(hangHoas.map((h) => [h.ma, h]));

    let totalAmount = 0; // Biến để tính tổng tiền

    // Kiểm tra số lượng tồn kho và tính tổng tiền
    for (const item of danhSachHangHoa) {
      const hangHoa = hangHoaMap.get(item.maHangHoa);
      if (!hangHoa || hangHoa.soLuong < item.soLuong) {
        throw new BadRequestException(
          `Không đủ số lượng để xuất với mã: ${item.maHangHoa}`,
        );
      }

      // Tính tổng tiền cho từng hàng hóa
      totalAmount += hangHoa.giaNhap * item.soLuong;
    }

    // Step 2: Tạo phiếu xuất mới
    const phieuXuat = await this.phieuXuatModel.create({ ma, totalAmount: 0 });

    // Step 3: Cập nhật tồn kho và tạo bản ghi chi tiết
    for (const item of danhSachHangHoa) {
      const hangHoa = hangHoaMap.get(item.maHangHoa);

      // Trừ số lượng tồn kho
      hangHoa.soLuong -= item.soLuong;
      await hangHoa.save();

      // Tạo bản ghi chi tiết trong PhieuXuatHangHoa
      await this.phieuXuatHangHoaModel.create({
        maPhieuXuat: phieuXuat.ma,
        maHangHoa: item.maHangHoa,
        soLuong: item.soLuong,
      });
    }

    // Step 4: Cập nhật tổng tiền cho phiếu xuất
    phieuXuat.totalAmount = totalAmount;
    await phieuXuat.save();

    // Step 5: Tạo liên kết với đại lý (nếu có trường lưu trữ)
    await phieuXuat.update({ maDaiLy });

    // Trả về mã phiếu xuất
    return phieuXuat.ma;
  }

  async findAll(): Promise<PhieuXuat[]> {
    return this.phieuXuatModel.findAll();
  }

  async deletePhieuXuat(id: string): Promise<void> {
    const PhieuXuat = await this.phieuXuatModel.findByPk(id);
    await PhieuXuat.destroy();
  }

  async findPhieuXuatByMa(ma: string): Promise<PhieuXuat> {
    const phieuXuat = await this.phieuXuatModel.findOne({
      where: { ma },
    });

    if (!phieuXuat) {
      throw new NotFoundException(`Không tìm thấy phiếu xuất với mã ${ma}`);
    }

    return phieuXuat;
  }
}
