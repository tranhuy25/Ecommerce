import { Controller, Get } from '@nestjs/common';
import { PhieuXuatHangHoaService } from './phieu-xuat-hang-hoa.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PhieuXuatHangHoa } from './model/phieu-xuat-hang-hoa.model';

@ApiTags('PhieuXuatHangHoa')
@Controller('phieu-xuat-hang-hoa')
export class PhieuXuatHangHoaController {
  constructor(
    private readonly phieuXuatHangHoaService: PhieuXuatHangHoaService,
  ) {}

  @Get('get-du-lieu')
  @ApiOperation({ summary: 'Lấy Dữ liệu Hàng Hóa hàng hóa cho phiếu xuất' })
  @ApiResponse({ status: 201, type: PhieuXuatHangHoa })
  findOne() {
    return this.phieuXuatHangHoaService.findAll();
  }
}
