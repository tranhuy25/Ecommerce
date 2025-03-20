import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import { NhaCungCapService } from './nha-cung-cap.service';
import { NhaCungCap } from './model/nha-cung-cap.model';
import { CreateNhaCungCapDto } from './dto/create-nha-cung-cap.dto';
import { UpdateNhaCungCapDto } from './dto/update-nha-cung-cap.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Nha Cung Cap')
@Controller('nha-cung-cap')
export class NhaCungCapController {
  constructor(private readonly nhaCungCapService: NhaCungCapService) {}

  // Thêm mới nhà cung cấp
  @Post('/create')
  async create(
    @Body() createNhaCungCapDto: CreateNhaCungCapDto,
  ): Promise<NhaCungCap> {
    return this.nhaCungCapService.createNhaCungCap(createNhaCungCapDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin nhà cung cấp' })
  async update(
    @Param('id') id: string,
    @Body() updateNhaCungCapDto: UpdateNhaCungCapDto,
  ): Promise<[number, NhaCungCap[]]> {
    return this.nhaCungCapService.updateNhaCungCap(id, updateNhaCungCapDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin nhà cung cấp theo id' })
  async findById(@Param('id') id: string): Promise<NhaCungCap> {
    return this.nhaCungCapService.findById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy thông tin nhà cung cấp' })
  async findAll(): Promise<NhaCungCap[]> {
    return this.nhaCungCapService.findAll();
  }

  @Get('search/by-ma')
  @ApiOperation({ summary: 'Lấy thông tin nhà cung cấp theo mã' })
  async findByMa(@Query('ma') ma: string): Promise<NhaCungCap> {
    return this.nhaCungCapService.findByMa(ma);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hủy tạo nhà cung cấp' })
  deleteNhaCungCap(@Param('id') id: string): Promise<void> {
    return this.nhaCungCapService.deleteNhaCungCap(id);
  }
}
