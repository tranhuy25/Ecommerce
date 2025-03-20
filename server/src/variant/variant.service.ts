import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Variant } from './entities/variant.entity';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Injectable()
export class VariantService {
  constructor(
    @InjectRepository(Variant)
    private variantRepo: Repository<Variant>,
  ) {}

  async findByIds(ids: number[]): Promise<Variant[]> {
    return await this.variantRepo.find({
      where: {
        id: In(ids),
        product: {
          isActive: true,
        },
      },
      relations: {
        product: {
          images: true,
        },
        attributeValues: true,
      },
    });
  }

  async create(createVariantDto: CreateVariantDto): Promise<Variant> {
    const newVariant = this.variantRepo.create(createVariantDto);
    return await this.variantRepo.save(newVariant);
  }

  async findAll(): Promise<Variant[]> {
    return await this.variantRepo.find({
      relations: {
        product: true,
        attributeValues: true,
      },
    });
  }

  async findOne(id: number): Promise<Variant> {
    const variant = await this.variantRepo.findOne({
      where: { id },
      relations: {
        product: true,
        attributeValues: true,
      },
    });
    if (!variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }
    return variant;
  }

  async update(
    id: number,
    updateVariantDto: UpdateVariantDto,
  ): Promise<Variant> {
    const variant = await this.variantRepo.preload({
      id,
      ...updateVariantDto,
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    return await this.variantRepo.save(variant);
  }

  async remove(id: number): Promise<void> {
    const result = await this.variantRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }
  }
}
