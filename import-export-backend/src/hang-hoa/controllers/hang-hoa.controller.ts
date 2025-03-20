import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { HangHoaService } from '../service/hang-hoa.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateHangHoaDto } from '../dto/create-hang-hoa-body';
import { HangHoa } from '../model/hang-hoa.model';
import { UpdateHangHoaDto } from '../dto/update-hang-hoa-dto';

@Controller('hanghoa')
@ApiResponse({ status: 200, type: HangHoa })
@ApiTags('Hang Hoa')
export class HangHoaController {
  constructor(private readonly hangHoaService: HangHoaService) {}

  @Post('/create-hang-hoa')
  @ApiOperation({ summary: 'Tạo Hàng Hóa' })
  create(@Body() createHangHoaDto: CreateHangHoaDto) {
    return this.hangHoaService.createHangHoa(createHangHoaDto);
  }

  @Get('/get-du-lieu')
  @ApiOperation({ summary: 'Lấy Dữ Liệu Thông Tin Hàng Hóa' })
  findAll() {
    return this.hangHoaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Tìm Kiếm Hàng Hóa' })
  findOne(@Param('id') id: string) {
    return this.hangHoaService.findOne(id);
  }

  @Put('/update/:ma')
  update(@Param('ma') ma: string, @Body() updateHangHoaDto: UpdateHangHoaDto) {
    return this.hangHoaService.updateHangHoa(ma, updateHangHoaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hủy Tạo Hàng Hóa' })
  remove(@Param('id') id: string) {
    return this.hangHoaService.deleteHangHoa(id);
  }

  @Get('find/:ma')
  @ApiOperation({ summary: 'Tìm Kiếm Thông Tin Hàng Hóa Theo Mã' })
  async findByMa(@Param('ma') ma: string): Promise<HangHoa> {
    return this.hangHoaService.findHangHoaByMa(ma);
  }

  @Get('find/:maDaiLy')
  async findHangHoaByMaDaiLy(
    @Param('ma dai ly') maDaiLy: string,
  ): Promise<HangHoa> {
    return this.hangHoaService.findHangHoaByMaDaiLy(maDaiLy);
  }
}
