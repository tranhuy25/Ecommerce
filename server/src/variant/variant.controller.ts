import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { VariantService } from './variant.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Controller('variant')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Post('active')
  async findAllByIds(@Body() ids: number[]) {
    return this.variantService.findByIds(ids);
  }

  @Post('create')
  create(@Body() createVariantDto: CreateVariantDto) {
    return this.variantService.create(createVariantDto);
  }

  @Get('find/all')
  findAll() {
    return this.variantService.findAll();
  }

  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.variantService.findOne(+id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateVariantDto: UpdateVariantDto) {
    return this.variantService.update(+id, updateVariantDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.variantService.remove(+id);
  }
}
