import { Controller, Post, Get, Param, Query } from '@nestjs/common';
import { BillXuatService } from './bill-xuat.service';
import { BillXuat } from './model/bill-xuat-model';
import { ApiTags } from '@nestjs/swagger';

@Controller('bill-xuat')
@ApiTags('Bill Xuat')
export class BillXuatController {
  constructor(private readonly billXuatService: BillXuatService) {}

  // Endpoint để tạo Bill Xuất
  @Post('create/:maPhieuXuat')
  async createBillXuat(
    @Param('maPhieuXuat') maPhieuXuat: string,
    @Query('maHangHoa') maHangHoa: string,
    @Query('quantity') quantity: number,
  ): Promise<BillXuat> {
    try {
      return await this.billXuatService.createBillXuat(
        maPhieuXuat,
        maHangHoa,
        quantity,
      );
    } catch (error) {
      throw new Error(`Lỗi khi tạo Bill Xuất: ${error.message}`);
    }
  }

  // Endpoint để tính tổng tiền của Phiếu Xuất
  @Get(':maPhieuXuat/total/:maPhieuXuat')
  async getTotalAmount(
    @Param('maPhieuXuat') maPhieuXuat: string,
  ): Promise<number> {
    try {
      return await this.billXuatService.calculateTotalAmount(maPhieuXuat);
    } catch (error) {
      throw new Error(`Lỗi khi tính tổng tiền: ${error.message}`);
    }
  }
}
