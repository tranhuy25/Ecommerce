import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PhieuXuatService } from './phieu-xuat.service';
import { CreatePhieuXuatDto } from './dto/create-phieu-xuat.body.dto';
import { PhieuXuat } from './model/phieu-xuat-model';

@ApiTags('PhieuXuat')
@Controller('phieu-xuat')
export class PhieuXuatController {
  constructor(private readonly phieuXuatService: PhieuXuatService) {}

  @Post('create')
  @ApiOperation({ summary: 'Tạo Phiếu Xuất Cho Hàng Hóa' })
  @ApiResponse({ status: 200, type: PhieuXuat })
  @ApiResponse({ status: 400, description: 'Không Đủ Số Lượng Để Xuất Hàng.' })
  async createPhieuXuat(
    @Query() maDaiLy: string,
    @Body() createPhieuXuatDto: CreatePhieuXuatDto,
  ): Promise<string> {
    try {
      // Gọi service để xử lý logic tạo phiếu xuất
      const maPhieuXuat = await this.phieuXuatService.placeOrder(
        createPhieuXuatDto,
        maDaiLy,
      );
      return `Phiếu xuất được tạo thành công với mã: ${maPhieuXuat}`;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(`Lỗi: ${error.message}`);
      }
      throw new BadRequestException('Có lỗi xảy ra khi tạo phiếu xuất', error);
    }
  }
  @Get('/get-du-lieu')
  @ApiOperation({ summary: 'Lấy Thông Tin Phiếu Xuất' })
  @ApiResponse({ status: 200, type: PhieuXuat })
  findAll() {
    return this.phieuXuatService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hủy Tạo Phiếu Xuất Cho Hàng Hóa' })
  @ApiResponse({ status: 200, type: PhieuXuat })
  remove(@Param('id') id: string) {
    return this.phieuXuatService.deletePhieuXuat(id);
  }

  @Get('find/:ma')
  @ApiOperation({ summary: 'Tìm Kiếm Thông Tin Phiếu Xuất Theo Mã' })
  async findPhieuXuatByMa(@Param('ma') ma: string): Promise<PhieuXuat> {
    return this.phieuXuatService.findPhieuXuatByMa(ma);
  }
}
