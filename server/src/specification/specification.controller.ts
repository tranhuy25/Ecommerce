import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { SpecificationService } from './specification.service';
import { CreateSpecificationDto } from './dto/create-specification.dto';
import { UpdateSpecificationDto } from './dto/update-specification.dto';

@Controller('specifications')
export class SpecificationController {
  constructor(private readonly specificationService: SpecificationService) {}

  @Post()
  create(@Body() createSpecificationDto: CreateSpecificationDto) {
    return this.specificationService.create(createSpecificationDto);
  }

  @Get('thong-ke/me')
  findAll() {
    return this.specificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('Received ID:', id);
    return this.specificationService.findOne(parseInt(id, 10));
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateSpecificationDto: UpdateSpecificationDto,
  ) {
    return this.specificationService.update(id, updateSpecificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.specificationService.remove(id);
  }

  @Get('product/:productId')
  async getSpecificationsByProduct(@Param('productId') productId: number) {
    return this.specificationService.findByProductId(Number(productId));
  }
}
