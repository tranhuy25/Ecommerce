import { Injectable } from '@nestjs/common';
import { BillXuat } from './model/bill-xuat-model';
import { InjectModel } from '@nestjs/sequelize';
import { HangHoa } from 'src/hang-hoa/model/hang-hoa.model';
import { HangHoaService } from 'src/hang-hoa/service/hang-hoa.service';
import { PhieuXuat } from 'src/phieu-xuat/model/phieu-xuat-model';

@Injectable()
export class BillXuatService {
  constructor(
    @InjectModel(BillXuat) private readonly billXuatModel: typeof BillXuat,
    @InjectModel(PhieuXuat) private readonly phieuXuatModel: typeof PhieuXuat,
    @InjectModel(HangHoa) private readonly hangHoaModel: typeof HangHoa,
    private readonly hangHoaService: HangHoaService,
  ) {}

  async createBillXuat(
    maPhieuXuat: string,
    maHangHoa: string,
    quantity: number,
  ): Promise<BillXuat> {
    // Bước 1: Lấy thông tin hàng hóa
    const hangHoa = await this.hangHoaService.findHangHoaByMa(maHangHoa);
    if (!hangHoa) {
      throw new Error('Hàng hóa không tồn tại');
    }

    // Bước 2: Kiểm tra số lượng hàng hóa
    if (hangHoa.soLuong < quantity) {
      throw new Error('Số lượng hàng hóa không đủ');
    }

    // Bước 3: Tính giá
    const unitPrice = hangHoa.giaNhap * 1.08; // Giả sử giá bán = giá nhập * 1.08
    const totalPrice = unitPrice * quantity;

    // Bước 4: Tạo bill xuất
    const newBillXuat = await this.billXuatModel.create({
      maPhieuXuat,
      maHangHoa,
      productName: hangHoa.ten,
      quantity,
      unitPrice,
      totalPrice,
    });

    // // Bước 5: Giảm số lượng hàng hóa sau khi tạo Bill Xuất
    // await this.hangHoaService.updateHangHoa(
    //   hangHoa.ma,
    //   hangHoa.soLuong - quantity,
    // );

    return newBillXuat;
  }

  async calculateTotalAmount(maPhieuXuat: string): Promise<number> {
    // Lấy tất cả các Bill Xuất thuộc về phiếu xuất cụ thể
    const bills = await this.billXuatModel.findAll({
      where: { maPhieuXuat },
    });

    // Tính tổng của tất cả các `totalPrice` trong các Bill Xuất
    return bills.reduce((sum, bill) => sum + bill.totalPrice, 0);
  }
}
