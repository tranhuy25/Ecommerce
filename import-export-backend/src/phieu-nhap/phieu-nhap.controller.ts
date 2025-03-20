import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PhieuNhapService } from './phieu-nhap.service';
import { PhieuNhap } from './model/phieu-nhap-model';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePhieuNhapDto } from './dto/create-phieu-nhap.dto';
@ApiTags('Phieu Nhap')
@Controller('phieu-nhap')
export class PhieuNhapController {
  constructor(private phieuNhapService: PhieuNhapService) {}

  @Post('search')
  @ApiOperation({ summary: 'Tìm kiếm thông tin phiếu nhập theo id ' })
  async searchphieuNhap(@Param('id') id: string) {
    return await this.phieuNhapService.findOne(id);
  }

  @Get('find')
  @ApiOperation({ summary: 'Get dữ liệu thông tin phiếu nhập' })
  async timKiemTT() {
    return await this.phieuNhapService.findAll();
  }

  @Post('create')
  @ApiOperation({ summary: 'Tạo phiếu nhập' })
  async createphieuNhap(
    @Body() phieuNhap: CreatePhieuNhapDto,
  ): Promise<PhieuNhap> {
    return await this.phieuNhapService.createPhieuNhap(phieuNhap);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hủy phiếu nhập' })
  remove(@Param('id') id: string) {
    return this.phieuNhapService.deletePhieuXuat(id);
  }
}
