import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PhieuXuatDaiLy } from './model/phieu-xuat-dai-ly.model';
import { PhieuXuatDaiLyService } from './phieu-xuat-dai-ly.service';

@ApiTags('Phieu Xuat Dai Ly')
@Controller('phieu-xuat-dai-ly')
export class PhieuXuatDaiLyController {
  constructor(private readonly phieuXuatDaiLyService: PhieuXuatDaiLyService) {}

  @Get('get-du-lieu')
  @ApiOperation({ summary: 'Lấy Dữ liệu Hàng Hóa hàng hóa cho phiếu xuất' })
  @ApiResponse({ status: 201, type: PhieuXuatDaiLy })
  findOne() {
    return this.phieuXuatDaiLyService.findAll();
  }
}
