import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specification } from './entities/specification.entity';
import { CreateSpecificationDto } from './dto/create-specification.dto';
import { UpdateSpecificationDto } from './dto/update-specification.dto';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class SpecificationService {
  constructor(
    @InjectRepository(Specification)
    private readonly specificationRepository: Repository<Specification>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(
    createSpecificationDto: CreateSpecificationDto,
  ): Promise<Specification> {
    const newSpec = this.specificationRepository.create(createSpecificationDto);
    return this.specificationRepository.save(newSpec);
  }

  async findAll(): Promise<Specification[]> {
    return this.specificationRepository.find();
  }

  async findByProductId(productId: number): Promise<Specification[]> {
    const specs = await this.specificationRepository.find({
      where: { productId },
      relations: ['product'], // Nếu cần lấy thông tin sản phẩm kèm theo
    });

    if (!specs.length) {
      throw new NotFoundException(
        `Không tìm thấy thông số kỹ thuật cho sản phẩm có ID ${productId}`,
      );
    }

    return specs;
  }

  async findOne(id: number): Promise<Specification> {
    const spec = await this.specificationRepository.findOne({ where: { id } });
    if (!spec) {
      throw new NotFoundException(`Specification with ID ${id} not found`);
    }
    return spec;
  }

  async update(
    id: number,
    updateSpecificationDto: UpdateSpecificationDto,
  ): Promise<Specification> {
    const spec = await this.findOne(id);
    Object.assign(spec, updateSpecificationDto);
    return this.specificationRepository.save(spec);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.specificationRepository.delete(id);
  }
}
